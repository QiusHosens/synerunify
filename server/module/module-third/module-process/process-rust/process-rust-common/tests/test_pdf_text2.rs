use regex::Regex;
use lazy_static::lazy_static;

#[derive(Debug)]
struct Invoice {
    invoice_type: String,
    seller_name: String,
    seller_tax_id: String,
    buyer_name: String,
    buyer_tax_id: String,
    item_name: String,
    model: String,
    unit: String,
    quantity: f32,
    unit_price: f32,
    amount: f32,
    tax_rate: String,
    tax_amount: f32,
    total_amount: f32,
    total_amount_uppercase: String,
    order_id: String,
    issuer: String,
    invoice_number: String,
    invoice_date: String,
}

fn parse_invoice(text: &str) -> Option<Invoice> {
    lazy_static! {
        static ref RE: Regex = Regex::new(
            r#"(?x)
            电子发票.*?\n
            名\s*称:\s*(?P<seller_name>.+)\n
            统一社会信用代码/纳税人识别号:\s*(?P<seller_tax_id>.+)\n
            (?P<item_name>\*.+?)\n
            (?P<model>\w+)\s+台\s+(?P<quantity>\d+)\s+(?P<unit_price>[\d.]+)\s+(?P<amount>[\d.]+)\s+(?P<tax_amount>[\d.]+)\s+(?P<tax_rate>\d+%)\n
            ¥(?P<amount2>[\d.]+)\s+¥(?P<tax_amount2>[\d.]+)\n
            (?P<total_amount_uppercase>.+?)\s+¥(?P<total_amount>[\d.]+)\n
            订单号:(?P<order_id>\d+)\n
            (?P<issuer>.+)\n
            (?P<invoice_number>\d+)\n
            (?P<invoice_date>\d{4}年\d{2}月\d{2}日)
            "#
        ).unwrap();
    }

    let caps = RE.captures(text)?;

    Some(Invoice {
        invoice_type: "电子普通发票".to_string(),
        seller_name: caps["seller_name"].trim().to_string(),
        seller_tax_id: caps["seller_tax_id"].trim().to_string(),
        buyer_name: "个人".to_string(), // 固定为文本中的“个人”
        buyer_tax_id: "".to_string(),  // 未提供
        item_name: caps["item_name"].trim().to_string(),
        model: caps["model"].trim().to_string(),
        unit: "台".to_string(),
        quantity: caps["quantity"].parse().ok()?,
        unit_price: caps["unit_price"].parse().ok()?,
        amount: caps["amount"].parse().ok()?,
        tax_rate: caps["tax_rate"].to_string(),
        tax_amount: caps["tax_amount"].parse().ok()?,
        total_amount: caps["total_amount"].parse().ok()?,
        total_amount_uppercase: caps["total_amount_uppercase"].to_string(),
        order_id: caps["order_id"].to_string(),
        issuer: caps["issuer"].to_string(),
        invoice_number: caps["invoice_number"].to_string(),
        invoice_date: caps["invoice_date"].to_string(),
    })
}

#[tokio::test]
async fn test_pdf_parse() {
    let text = r#"
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

信

息

名 称:

统一社会信用代码/纳税人识别号:

项目名称 规格型号 单位 数 量 单 价 金 额 税率/征收率 税 额 

电子发票(普通发票)

名 称:

统一社会信用代码/纳税人识别号:

成都京东惠加贸易有限公司 个人

91510100MA65U3R06T

*其他机械设备*ETCSP2025款拇指etc智能无

卡etc设备微信扣费多位置隐藏全国通用95折

135B 台 1 146.9 146.90 19.10 13%

¥146.90 ¥19.10

壹佰陆拾陆圆整 ¥166.00

订单号:325201944999

王梅

25517000000244113205

2025年07月09日
"#;

    if let Some(invoice) = parse_invoice(text) {
        println!("{:#?}", invoice);
    } else {
        println!("未能解析发票内容");
    }
}
