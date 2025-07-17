#[derive(Debug)]
pub struct Invoice {
    pub invoice_type: String,
    pub invoice_number: Option<String>,
    pub invoice_date: Option<String>,
    pub seller_info: PartyInfo,
    pub buyer_info: PartyInfo,
    pub items: Vec<InvoiceItem>,
    pub total_amount_excluding_tax: Option<f64>,
    pub total_tax_amount: Option<f64>,
    pub total_amount_chinese: Option<String>,
    pub total_amount_lowercase: Option<f64>,
    pub cashier: Option<String>,
    pub notes: Option<String>,
    pub order_number: Option<String>, // Based on the example, this seems to be a note or additional info.
}

#[derive(Debug, Default)]
pub struct PartyInfo {
    pub name: Option<String>,
    pub tax_id: Option<String>,
}

#[derive(Debug)]
pub struct InvoiceItem {
    pub project_name: String,
    pub specification: Option<String>,
    pub unit: Option<String>,
    pub quantity: Option<f64>,
    pub unit_price: Option<f64>,
    pub amount: Option<f64>,
    pub tax_rate: Option<String>, // Can be a percentage or specific rate
    pub tax_amount: Option<f64>,
}

use regex::Regex;

pub fn parse_invoice(invoice_text: &str) -> Option<Invoice> {
    let mut invoice = Invoice {
        invoice_type: "电子发票(普通发票)".to_string(), // This seems constant from your example
        invoice_number: None,
        invoice_date: None,
        seller_info: PartyInfo::default(),
        buyer_info: PartyInfo::default(),
        items: Vec::new(),
        total_amount_excluding_tax: None,
        total_tax_amount: None,
        total_amount_chinese: None,
        total_amount_lowercase: None,
        cashier: None,
        notes: None,
        order_number: None,
    };

    let lines: Vec<&str> = invoice_text.lines().collect();

    // Regex for various fields
    let invoice_num_re = Regex::new(r"发票号码:\s*(\S+)").unwrap();
    let invoice_date_re = Regex::new(r"\s*(\d{4}年\d{2}月\d{2}日)").unwrap();
    let cashier_re = Regex::new(r"开票人:\s*(\S+)").unwrap();
    let total_lowercase_re = Regex::new(r"¥(\d+\.\d{2})\s*¥(\d+\.\d{2})").unwrap(); // For total excluding tax and total tax
    let total_chinese_re = Regex::new(r"([拾佰仟万亿圆整零壹贰叁肆伍陆柒捌玖]+)\s*¥(\d+\.\d{2})").unwrap();
    let order_num_re = Regex::new(r"订单号:(\d+)").unwrap();

    // Party Info Regex (simplified, might need more robust handling for multi-line names)
    let party_name_re = Regex::new(r"名 称:\s*(.*)").unwrap();
    let party_tax_id_re = Regex::new(r"统一社会信用代码/纳税人识别号:\s*(.*)").unwrap();

    // Item parsing regex (this will be the most complex part)
    // This is a very simplified regex and might not capture all variations.
    // It assumes a specific order and might need adjustments based on real-world data.
    let item_re = Regex::new(
        r"(\*.*?\*.*?)\s*(\S+)\s*(\S+)\s*(\d+)\s*(\d+\.\d+)\s*(\d+\.\d+)\s*(\d+\.\d+%)?\s*(\d+\.\d+)?",
    ).unwrap();


    let mut in_seller_info = false;
    let mut in_buyer_info = false;
    let mut in_items_section = false;

    for line in lines {
        if line.contains("销") && line.contains("售") && line.contains("方") && line.contains("信") && line.contains("息") {
            in_seller_info = true;
            in_buyer_info = false;
            in_items_section = false;
            continue;
        } else if line.contains("购") && line.contains("买") && line.contains("方") && line.contains("信") && line.contains("息") {
            in_buyer_info = true;
            in_seller_info = false;
            in_items_section = false;
            continue;
        } else if line.contains("项目名称") && line.contains("规格型号") {
            in_items_section = true;
            in_seller_info = false;
            in_buyer_info = false;
            continue;
        }

        if in_seller_info {
            if let Some(captures) = party_name_re.captures(line) {
                invoice.seller_info.name = captures.get(1).map(|m| m.as_str().trim().to_string());
            }
            if let Some(captures) = party_tax_id_re.captures(line) {
                invoice.seller_info.tax_id = captures.get(1).map(|m| m.as_str().trim().to_string());
            }
        } else if in_buyer_info {
            if let Some(captures) = party_name_re.captures(line) {
                invoice.buyer_info.name = captures.get(1).map(|m| m.as_str().trim().to_string());
            }
            if let Some(captures) = party_tax_id_re.captures(line) {
                invoice.buyer_info.tax_id = captures.get(1).map(|m| m.as_str().trim().to_string());
            }
        } else if in_items_section {
            // This is where you'd parse individual items.
            // This example is highly simplified and assumes clean, single-line items.
            if let Some(captures) = item_re.captures(line) {
                if let Some(project_name) = captures.get(1) {
                    let item = InvoiceItem {
                        project_name: project_name.as_str().trim().to_string(),
                        specification: captures.get(2).map(|m| m.as_str().trim().to_string()),
                        unit: captures.get(3).map(|m| m.as_str().trim().to_string()),
                        quantity: captures.get(4).and_then(|m| m.as_str().parse::<f64>().ok()),
                        unit_price: captures.get(5).and_then(|m| m.as_str().parse::<f64>().ok()),
                        amount: captures.get(6).and_then(|m| m.as_str().parse::<f64>().ok()),
                        tax_rate: captures.get(7).map(|m| m.as_str().trim().to_string()),
                        tax_amount: captures.get(8).and_then(|m| m.as_str().parse::<f64>().ok()),
                    };
                    invoice.items.push(item);
                }
            }
        }

        // Parse global fields regardless of section
        if let Some(captures) = invoice_num_re.captures(line) {
            invoice.invoice_number = captures.get(1).map(|m| m.as_str().trim().to_string());
        }
        if let Some(captures) = invoice_date_re.captures(line) {
            invoice.invoice_date = captures.get(1).map(|m| m.as_str().trim().to_string());
        }
        if let Some(captures) = cashier_re.captures(line) {
            invoice.cashier = captures.get(1).map(|m| m.as_str().trim().to_string());
        }
        if let Some(captures) = total_lowercase_re.captures(line) {
            invoice.total_amount_excluding_tax = captures.get(1).and_then(|m| m.as_str().parse::<f64>().ok());
            invoice.total_tax_amount = captures.get(2).and_then(|m| m.as_str().parse::<f64>().ok());
        }
        if let Some(captures) = total_chinese_re.captures(line) {
            invoice.total_amount_chinese = captures.get(1).map(|m| m.as_str().trim().to_string());
            invoice.total_amount_lowercase = captures.get(2).and_then(|m| m.as_str().parse::<f64>().ok());
        }
        if let Some(captures) = order_num_re.captures(line) {
            invoice.order_number = captures.get(1).map(|m| m.as_str().trim().to_string());
        }
    }

    Some(invoice)
}

// How to use it:
#[tokio::test]
async fn test_pdf_parse() {
    let invoice_text = r#"
合 计

价税合计(大写) (小写)

备
 开票人:

注
 发票号码:

开票日期:

销
售
方
信
息

购
买
方
信 息
 名 称:

统一社会信用代码/纳税人识别号:

项目名称 规格型号    单位  数 量   单 价 金  额   税率/征收率   税  额

电子发票(普通发票)

名 称:

统一社会信用代码/纳税人识别号:
 成都京东惠加贸易有限公司个人
 91510100MA65U3R06T

*其他机械设备*ETCSP2025款拇指etc智能无 135B 台 1 146.9 146.90 19.1013%

¥146.90 ¥19.10

壹佰陆拾陆圆整 ¥166.00

订单号:325201944999

王梅
 25517000000244113205

2025年07月09日
    "#;

    // println!("parse_invoice");
    match parse_invoice(invoice_text) {
        Some(invoice) => {
            println!("invoice, {:#?}", invoice);
        }
        None => {
            println!("Failed to parse invoice.");
        }
    }
}