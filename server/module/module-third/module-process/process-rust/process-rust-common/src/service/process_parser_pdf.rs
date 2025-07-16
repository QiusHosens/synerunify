use std::{collections::HashMap, fs};

use anyhow::Result;
use chrono::NaiveDate;
use regex::Regex;
use serde::Deserialize;

use pdf::file::File as PdfFile;

use crate::model::invoice::{BaseInvoice, ElectronicInvoice, InternationalInvoice, Invoice, InvoiceItem, InvoiceParseResult, Party, VatOrdinaryInvoice, VatSpecialInvoice};

/// 解析电子发票
pub async fn parse_invoice<T>(pdf_data: Vec<u8>) -> Result<Option<InvoiceParseResult<T>>>
  where
    T: for<'de> Deserialize<'de> + std::fmt::Debug + Clone, {
  let text = pdf_extract::extract_text_from_mem(&pdf_data).unwrap();
  println!("pdf content, {}", text);

  // 正则表达式提取关键字段
  let invoice_number_re = Regex::new(r"Invoice Number:?\s*(\w+)")?;
  let invoice_code_re = Regex::new(r"Invoice Code:?\s*(\w+)")?;
  let date_re = Regex::new(r"Invoice Date:?\s*(\d{4}-\d{2}-\d{2})")?;
  let seller_name_re = Regex::new(r"Seller:?\s*([^\n]+)")?;
  let buyer_name_re = Regex::new(r"Buyer:?\s*([^\n]+)")?;
  let currency_re = Regex::new(r"Currency:?\s*(\w+)")?;
  let digital_signature_re = Regex::new(r"Digital Signature:?\s*(\w+)")?;
  let qr_code_re = Regex::new(r"QR Code:?\s*(\S+)")?;
  let incoterms_re = Regex::new(r"Incoterms:?\s*(\w+)")?;
  let country_of_origin_re = Regex::new(r"Country of Origin:?\s*([^\n]+)")?;
  let tax_exemption_re = Regex::new(r"Tax Exemption:?\s*(true|false)")?;
  let bank_info_re = Regex::new(r"Bank Info:?\s*([^\n]+)")?;

  // 提取字段
  let invoice_number = invoice_number_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let invoice_code = invoice_code_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let issue_date = date_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str()))
      .and_then(|date| NaiveDate::parse_from_str(date, "%Y-%m-%d").ok());
  let seller_name = seller_name_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let buyer_name = buyer_name_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let currency = currency_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let digital_signature = digital_signature_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let qr_code = qr_code_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let incoterms = incoterms_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let country_of_origin = country_of_origin_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));
  let tax_exemption = tax_exemption_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str() == "true"));
  let bank_info = bank_info_re
      .captures(&text)
      .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()));

  // 提取明细项（假设表格格式）
  let item_re = Regex::new(r"Item:?\s*([^\n]+)\s*Model:?\s*([^\n]+)\s*Unit:?\s*([^\n]+)\s*Quantity:?\s*(\d+\.?\d*)\s*Unit Price:?\s*(\d+\.?\d*)\s*Tax Rate:?\s*(\d+\.?\d*)")?;
  let mut items = Vec::new();
  for cap in item_re.captures_iter(&text) {
      let name = cap.get(1).map(|m| m.as_str().to_string()).unwrap_or_default();
      let specification_model = cap.get(2).map(|m| m.as_str().to_string()).unwrap_or_default();
      let unit = cap.get(3).map(|m| m.as_str().to_string()).unwrap_or_default();
      let quantity = cap.get(4).and_then(|m| m.as_str().parse::<f64>().ok()).unwrap_or(0.0);
      let unit_price = cap.get(5).and_then(|m| m.as_str().parse::<f64>().ok()).unwrap_or(0.0);
      let tax_rate = cap.get(6).and_then(|m| m.as_str().parse::<f64>().ok()).unwrap_or(0.0);
      items.push(InvoiceItem::new(name, specification_model, unit, quantity, unit_price, tax_rate));
  }

  // 构造基础发票
  let base_invoice = if let (Some(invoice_number), Some(issue_date), Some(seller_name), Some(buyer_name), Some(currency)) =
      (invoice_number, issue_date, seller_name, buyer_name, currency)
  {
      let mut base = BaseInvoice::new(
          invoice_number,
          issue_date,
          Party {
              name: seller_name,
              address: "Unknown".to_string(),
              tax_id: None,
              contact: None,
          },
          Party {
              name: buyer_name,
              address: "Unknown".to_string(),
              tax_id: None,
              contact: None,
          },
          currency,
      );
      for item in items {
          base.add_item(item);
      }
      base
  } else {
      return Ok(None);
  };

  // 转换为 JSON 用于泛型内容
  // let json_text = fs::read_to_string(pdf_path)?;
  // let content: T = serde_json::from_str(&json_text).map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
  let content: T = serde_json::from_str("")?;

  // 判断发票类型
  if digital_signature.is_some() && qr_code.is_some() {
      if let Some(invoice_code) = invoice_code {
          return Ok(Some(InvoiceParseResult {
              invoice: Invoice::Electronic(ElectronicInvoice {
                  base: base_invoice,
                  invoice_code,
                  digital_signature: digital_signature.unwrap_or_default(),
                  qr_code: qr_code.unwrap_or_default(),
              }),
              invoice_type: "Electronic".to_string(),
              content,
          }));
      }
  } else if incoterms.is_some() && country_of_origin.is_some() {
      if let (Some(due_date), Some(invoice_code)) = (
          NaiveDate::parse_from_str("2025-08-14", "%Y-%m-%d").ok(),
          invoice_code,
      ) {
          return Ok(Some(InvoiceParseResult {
              invoice: Invoice::International(InternationalInvoice {
                  base: base_invoice,
                  due_date,
                  incoterms: incoterms.unwrap_or_default(),
                  country_of_origin: country_of_origin.unwrap_or_default(),
                  hs_codes: HashMap::new(),
              }),
              invoice_type: "International".to_string(),
              content,
          }));
      }
  } else if tax_exemption.is_some() && bank_info.is_some() {
      if let (Some(due_date), Some(invoice_code)) = (
          NaiveDate::parse_from_str("2025-08-14", "%Y-%m-%d").ok(),
          invoice_code,
      ) {
          return Ok(Some(InvoiceParseResult {
              invoice: Invoice::VatSpecial(VatSpecialInvoice {
                  base: base_invoice,
                  due_date,
                  invoice_code,
                  tax_exemption: tax_exemption.unwrap_or(false),
                  bank_info: bank_info.unwrap_or_default(),
              }),
              invoice_type: "VatSpecial".to_string(),
              content,
          }));
      }
  } else if invoice_code.is_some() {
      if let Some(invoice_code) = invoice_code {
          return Ok(Some(InvoiceParseResult {
              invoice: Invoice::VatOrdinary(VatOrdinaryInvoice {
                  base: base_invoice,
                  invoice_code,
              }),
              invoice_type: "VatOrdinary".to_string(),
              content,
          }));
      }
  }

  Ok(None)
}