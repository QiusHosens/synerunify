use regex::Regex;
use std::collections::HashMap;

struct Invoice {
    pub title: String,
    pub invoice_number: String,
    pub date: String,
    pub seller: Seller,
    pub buyer: Buyer,
    pub items: Vec<Item>,
    pub total_amount: f64,
    pub total_tax: f64,
    pub grand_total: f64,
    pub grand_total_text: String,
    pub notes: String,
}

struct Seller {
    pub name: String,
    pub tax_id: String,
}

struct Buyer {
    pub name: String,
    pub tax_id: String,
}

struct Item {
    pub name: String,
    pub model: String,
    pub unit: String,
    pub quantity: f64,
    pub price: f64,
    pub amount: f64,
    pub tax_rate: String,
    pub tax_amount: f64,
}

fn parse_invoice(text: &str) -> Result<Invoice, Box<dyn std::error::Error>> {
    // 编译正则表达式
    let title_re = Regex::new(r"电子发票\((.*?)\)")?;
    let date_re = Regex::new(r"开票日期[:：]\s*(\d{4}年\d{2}月\d{2}日)")?;
    let seller_name_re = Regex::new(r"销售方信息\s*名\s*称[:：]\s*([^\n]+)")?;
    let seller_tax_id_re = Regex::new(r"纳税人识别号[:：]\s*([^\n]+)")?;
    let buyer_name_re = Regex::new(r"购买方信息\s*名\s*称[:：]\s*([^\n]+)")?;
    let buyer_tax_id_re = Regex::new(r"纳税人识别号[:：]\s*([^\n]+)")?;
    let item_re = Regex::new(r"\*([^\*]+)\*([^\n]+?)\s+(\S+)\s+(\S+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+%)\s+([\d.]+)")?;
    let total_amount_re = Regex::new(r"金\s*额\s*[:：]\s*¥([\d.]+)")?;
    let total_tax_re = Regex::new(r"税\s*额\s*[:：]\s*¥([\d.]+)")?;
    let grand_total_re = Regex::new(r"价税合计\(小写\)[:：]\s*¥([\d.]+)")?;
    let grand_total_text_re = Regex::new(r"价税合计\(大写\)[:：]\s*([^\n]+)")?;
    let notes_re = Regex::new(r"备\s*注[:：]\s*([^\n]+)")?;
    
    // 发票号码正则 - 允许"发票号码:"和实际号码之间有换行
    let invoice_number_re = Regex::new(r"发票号码[:：]\s*([\s\S]*?)(?=\n|$)")?;
    
    // 提取标题
    let title = title_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "未知类型发票".to_string(), |m| m.as_str().to_string());

    // 提取发票号码 - 改进逻辑
    let invoice_number = {
        let candidate = invoice_number_re.captures(text)
            .and_then(|cap| cap.get(1))
            .map_or_else(|| "".to_string(), |m| m.as_str().trim().replace(" ", ""));
        
        // 如果候选匹配结果是纯数字且长度合理，则使用它
        if candidate.chars().all(|c| c.is_ascii_digit()) && candidate.len() >= 10 {
            candidate
        } else {
            // 否则，尝试从文本末尾提取发票号码
            let end_number_re = Regex::new(r"(\d{10,20})$")?;
            end_number_re.captures(text)
                .and_then(|cap| cap.get(1))
                .map_or_else(|| "".to_string(), |m| m.as_str().to_string())
        }
    };

    // 提取日期
    let date = date_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "".to_string(), |m| m.as_str().to_string());

    // 提取销售方信息
    let seller_name = seller_name_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "".to_string(), |m| m.as_str().to_string());
    
    let seller_tax_id = seller_tax_id_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "".to_string(), |m| m.as_str().to_string());

    let seller = Seller {
        name: seller_name,
        tax_id: seller_tax_id,
    };

    // 提取购买方信息
    let buyer_name = buyer_name_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "".to_string(), |m| m.as_str().to_string());
    
    let buyer_tax_id = buyer_tax_id_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "".to_string(), |m| m.as_str().to_string());

    let buyer = Buyer {
        name: buyer_name,
        tax_id: buyer_tax_id,
    };

    // 提取商品项目
    let mut items = Vec::new();
    for cap in item_re.captures_iter(text) {
        let item = Item {
            name: cap.get(1).map_or("", |m| m.as_str()).to_string(),
            model: cap.get(2).map_or("", |m| m.as_str()).trim().to_string(),
            unit: cap.get(3).map_or("", |m| m.as_str()).to_string(),
            quantity: cap.get(4).and_then(|m| m.as_str().parse().ok()).unwrap_or(0.0),
            price: cap.get(5).and_then(|m| m.as_str().parse().ok()).unwrap_or(0.0),
            amount: cap.get(6).and_then(|m| m.as_str().parse().ok()).unwrap_or(0.0),
            tax_rate: cap.get(7).map_or("", |m| m.as_str()).to_string(),
            tax_amount: cap.get(8).and_then(|m| m.as_str().parse().ok()).unwrap_or(0.0),
        };
        items.push(item);
    }

    // 提取金额信息
    let total_amount = total_amount_re.captures(text)
        .and_then(|cap| cap.get(1))
        .and_then(|m| m.as_str().parse().ok())
        .unwrap_or(0.0);
    
    let total_tax = total_tax_re.captures(text)
        .and_then(|cap| cap.get(1))
        .and_then(|m| m.as_str().parse().ok())
        .unwrap_or(0.0);
    
    let grand_total = grand_total_re.captures(text)
        .and_then(|cap| cap.get(1))
        .and_then(|m| m.as_str().parse().ok())
        .unwrap_or(0.0);
    
    let grand_total_text = grand_total_text_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "".to_string(), |m| m.as_str().to_string());

    // 提取备注
    let notes = notes_re.captures(text)
        .and_then(|cap| cap.get(1))
        .map_or_else(|| "".to_string(), |m| m.as_str().to_string());

    // 返回解析结果
    Ok(Invoice {
        title,
        invoice_number,
        date,
        seller,
        buyer,
        items,
        total_amount,
        total_tax,
        grand_total,
        grand_total_text,
        notes,
    })
}

#[tokio::test]
async fn test_pdf_parse() {
    let invoice_text = r#"
合
计
价税合计(大写)
(小写)
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
信
息
名
称:
统一社会信用代码/
纳税人识别号:
项目名称
规格型号



单位

数 量


单 价
金  额


税率
/征收率


税  额
电子发票(普通发票)
名
称:
统一社会信用代码/
纳税人识别号:
成都京东惠加贸易有限公司
个人
91510100MA65U3R06T
*其他机械设备*ETCSP2025款拇指etc智能无
135B
台
1
146.9
146.90
19.10
13%
¥146.90
¥19.10
壹佰陆拾陆圆整
¥166.00
订单号:325201944999
王梅
25517000000244113205
2025年07月09日
    "#;

    match parse_invoice(invoice_text) {
        Ok(invoice) => {
            println!("发票类型: {}", invoice.title);
            println!("发票号码: {}", invoice.invoice_number);
            println!("开票日期: {}", invoice.date);
            println!("\n销售方:");
            println!("  名称: {}", invoice.seller.name);
            println!("  税号: {}", invoice.seller.tax_id);
            println!("\n购买方:");
            println!("  名称: {}", invoice.buyer.name);
            println!("  税号: {}", invoice.buyer.tax_id);
            println!("\n商品明细:");
            for (i, item) in invoice.items.iter().enumerate() {
                println!("  项目 {}: {}", i + 1, item.name);
                println!("    规格型号: {}", item.model);
                println!("    单位: {}, 数量: {}", item.unit, item.quantity);
                println!("    单价: {}, 金额: {}", item.price, item.amount);
                println!("    税率: {}, 税额: {}", item.tax_rate, item.tax_amount);
            }
            println!("\n金额汇总:");
            println!("  不含税金额: {}", invoice.total_amount);
            println!("  税额: {}", invoice.total_tax);
            println!("  价税合计: {}", invoice.grand_total);
            println!("  大写: {}", invoice.grand_total_text);
            println!("\n备注: {}", invoice.notes);
        },
        Err(e) => {
            eprintln!("解析发票失败: {}", e);
        }
    }
}    