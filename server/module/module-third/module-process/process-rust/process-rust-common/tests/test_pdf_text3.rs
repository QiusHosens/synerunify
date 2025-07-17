use pdf_extract::extract_text;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::fs;
use lopdf::Document;

// 结构化发票数据
#[derive(Debug, Serialize, Deserialize)]
struct Invoice {
    invoice_number: String,
    issue_date: String,
    seller: SellerInfo,
    buyer: BuyerInfo,
    items: Vec<Item>,
    total_amount: f64,
    total_tax: f64,
    total_with_tax: f64,
}

#[derive(Debug, Serialize, Deserialize)]
struct SellerInfo {
    name: String,
    tax_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct BuyerInfo {
    name: String,
    tax_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Item {
    name: String,
    model: String,
    unit: String,
    quantity: f64,
    unit_price: f64,
    amount: f64,
    tax_rate: String,
    tax_amount: f64,
}

#[tokio::test]
async fn test_pdf_parse() -> Result<(), Box<dyn std::error::Error>> {
    let file = "tests/invoice_personal_normal.pdf";
    let doc = Document::load(file).expect("无法加载 PDF 文件");
    let pages = doc.get_pages();
    println!("总页数: {:?}", pages.len());
    let text = doc.extract_text(&[1]).expect("提取文本失败");
    println!("{}", text);
    let input_text = &text.as_str();

    // 正则表达式提取关键字段
    let invoice_number_re = Regex::new(r"发票号码: (\d+)")?;
    let issue_date_re = Regex::new(r"开票日期: (\d{4}年\d{2}月\d{2}日)")?;
    let seller_name_re = Regex::new(r"名称: (.*?)\n统一社会信用代码")?;
    let seller_tax_id_re = Regex::new(r"统一社会信用代码/纳税人识别号: (.*?)\n")?;
    let buyer_name_re = Regex::new(r"名称: (.*?)\n统一社会信用代码")?;
    let total_with_tax_re = Regex::new(r"¥(\d+\.\d{2})")?;
    let item_re = Regex::new(r"\*(.*?)\*\n(.*?)\n(.*?)\n(\d+)\n(\d+\.\d+)\n(\d+\.\d+)\n(\d+\.\d+)\n(\d+%)\n")?;

    // 提取字段
    let invoice_number = invoice_number_re
        .captures(input_text)
        .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()))
        .unwrap_or_default();
    let issue_date = issue_date_re
        .captures(input_text)
        .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()))
        .unwrap_or_default();
    let seller_name = seller_name_re
        .captures(input_text)
        .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()))
        .unwrap_or_default();
    let seller_tax_id = seller_tax_id_re
        .captures(input_text)
        .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()))
        .unwrap_or_default();
    let buyer_name = buyer_name_re
        .captures(input_text)
        .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()))
        .unwrap_or("个人".to_string());
    let total_with_tax = total_with_tax_re
        .captures_iter(input_text)
        .last()
        .and_then(|cap| cap.get(1).map(|m| m.as_str().parse::<f64>().unwrap_or(0.0)))
        .unwrap_or(0.0);

    // 提取项目明细
    let items: Vec<Item> = item_re
        .captures_iter(input_text)
        .map(|cap| Item {
            name: cap.get(1).map(|m| m.as_str().to_string()).unwrap_or_default(),
            model: cap.get(2).map(|m| m.as_str().to_string()).unwrap_or_default(),
            unit: cap.get(3).map(|m| m.as_str().to_string()).unwrap_or_default(),
            quantity: cap.get(4).map(|m| m.as_str().parse::<f64>().unwrap_or(0.0)).unwrap_or(0.0),
            unit_price: cap.get(5).map(|m| m.as_str().parse::<f64>().unwrap_or(0.0)).unwrap_or(0.0),
            amount: cap.get(6).map(|m| m.as_str().parse::<f64>().unwrap_or(0.0)).unwrap_or(0.0),
            tax_rate: cap.get(8).map(|m| m.as_str().to_string()).unwrap_or_default(),
            tax_amount: cap.get(7).map(|m| m.as_str().parse::<f64>().unwrap_or(0.0)).unwrap_or(0.0),
        })
        .collect();

    // 构造发票对象
    let invoice = Invoice {
        invoice_number,
        issue_date,
        seller: SellerInfo {
            name: seller_name,
            tax_id: seller_tax_id,
        },
        buyer: BuyerInfo {
            name: buyer_name,
            tax_id: None,
        },
        items,
        total_amount: 0.0,
        total_tax: 0.0,
        // total_amount: items.iter().map(|item| item.amount).sum(),
        // total_tax: items.iter().map(|item| item.tax_amount).sum(),
        total_with_tax,
    };

    // 输出结构化结果
    println!("{:#?}", invoice);

    Ok(())
}