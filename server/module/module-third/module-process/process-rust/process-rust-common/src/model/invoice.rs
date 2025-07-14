use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// 交易方（卖方或买方）信息
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Party {
    pub name: String,              // 公司或个人名称
    pub address: String,           // 地址
    pub tax_id: Option<String>,    // 税务登记号（可选）
    pub contact: Option<String>,    // 联系方式（可选）
}

/// 发票明细项
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct InvoiceItem {
    pub name: String,              // 项目名称
    pub specification_model: String, // 规格型号
    pub unit: String,              // 单位
    pub quantity: f64,             // 数量
    pub unit_price: f64,           // 单价
    pub total: f64,                // 总金额（数量 * 单价）
    pub tax_rate: f64,             // 税率（如0.03表示3%）
    pub tax_amount: f64,           // 税额
}

impl InvoiceItem {
    pub fn new(
        name: String,
        specification_model: String,
        unit: String,
        quantity: f64,
        unit_price: f64,
        tax_rate: f64,
    ) -> Self {
        let total = quantity * unit_price;
        let tax_amount = total * tax_rate;
        InvoiceItem {
            name,
            specification_model,
            unit,
            quantity,
            unit_price,
            total,
            tax_rate,
            tax_amount,
        }
    }
}

/// 基础发票结构体，包含公共字段
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BaseInvoice {
    pub invoice_number: String,     // 发票号码
    pub issue_date: NaiveDate,     // 开票日期
    pub seller: Party,             // 卖方信息
    pub buyer: Party,              // 买方信息
    pub items: Vec<InvoiceItem>,   // 明细项列表
    pub subtotal: f64,             // 小计（不含税）
    pub total_tax: f64,            // 总税额
    pub total: f64,                // 总金额（含税）
    pub currency: String,           // 货币单位
    pub notes: Option<String>,     // 备注（可选）
    pub custom_fields: HashMap<String, String>, // 自定义字段
}

impl BaseInvoice {
    pub fn new(
        invoice_number: String,
        issue_date: NaiveDate,
        seller: Party,
        buyer: Party,
        currency: String,
    ) -> Self {
        BaseInvoice {
            invoice_number,
            issue_date,
            seller,
            buyer,
            items: Vec::new(),
            subtotal: 0.0,
            total_tax: 0.0,
            total: 0.0,
            currency,
            notes: None,
            custom_fields: HashMap::new(),
        }
    }

    pub fn add_item(&mut self, item: InvoiceItem) {
        self.items.push(item);
        self.calculate_totals();
    }

    pub fn calculate_totals(&mut self) {
        self.subtotal = self.items.iter().map(|item| item.total).sum();
        self.total_tax = self.items.iter().map(|item| item.tax_amount).sum();
        self.total = self.subtotal + self.total_tax;
    }
}

/// 增值税普通发票
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct VatOrdinaryInvoice {
    pub base: BaseInvoice,         // 基础发票字段
    pub invoice_code: String,       // 发票代码
}

impl VatOrdinaryInvoice {
    pub fn new(
        invoice_number: String,
        issue_date: NaiveDate,
        seller: Party,
        buyer: Party,
        currency: String,
        invoice_code: String,
    ) -> Self {
        VatOrdinaryInvoice {
            base: BaseInvoice::new(invoice_number, issue_date, seller, buyer, currency),
            invoice_code,
        }
    }

    pub fn add_item(&mut self, item: InvoiceItem) {
        self.base.add_item(item);
    }
}

/// 增值税专用发票
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct VatSpecialInvoice {
    pub base: BaseInvoice,         // 基础发票字段
    pub due_date: NaiveDate,       // 到期日期
    pub invoice_code: String,       // 发票代码
    pub tax_exemption: bool,       // 是否免税
    pub bank_info: String,         // 卖方银行账户信息
}

impl VatSpecialInvoice {
    pub fn new(
        invoice_number: String,
        issue_date: NaiveDate,
        due_date: NaiveDate,
        seller: Party,
        buyer: Party,
        currency: String,
        invoice_code: String,
        bank_info: String,
    ) -> Self {
        VatSpecialInvoice {
            base: BaseInvoice::new(invoice_number, issue_date, seller, buyer, currency),
            due_date,
            invoice_code,
            tax_exemption: false,
            bank_info,
        }
    }

    pub fn add_item(&mut self, item: InvoiceItem) {
        self.base.add_item(item);
        if self.tax_exemption {
            self.base.total_tax = 0.0;
            self.base.total = self.base.subtotal;
        }
    }
}

/// 电子发票
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ElectronicInvoice {
    pub base: BaseInvoice,         // 基础发票字段
    pub invoice_code: String,       // 发票代码
    pub digital_signature: String,  // 数字签名
    pub qr_code: String,           // 二维码链接
}

impl ElectronicInvoice {
    pub fn new(
        invoice_number: String,
        issue_date: NaiveDate,
        seller: Party,
        buyer: Party,
        currency: String,
        invoice_code: String,
        digital_signature: String,
        qr_code: String,
    ) -> Self {
        ElectronicInvoice {
            base: BaseInvoice::new(invoice_number, issue_date, seller, buyer, currency),
            invoice_code,
            digital_signature,
            qr_code,
        }
    }

    pub fn add_item(&mut self, item: InvoiceItem) {
        self.base.add_item(item);
    }
}

/// 国际发票
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct InternationalInvoice {
    pub base: BaseInvoice,         // 基础发票字段
    pub due_date: NaiveDate,       // 到期日期
    pub incoterms: String,         // 国际贸易术语（如FOB, CIF）
    pub country_of_origin: String,  // 原产国
    pub hs_codes: HashMap<String, String>, // 商品的HS编码
}

impl InternationalInvoice {
    pub fn new(
        invoice_number: String,
        issue_date: NaiveDate,
        due_date: NaiveDate,
        seller: Party,
        buyer: Party,
        currency: String,
        incoterms: String,
        country_of_origin: String,
    ) -> Self {
        InternationalInvoice {
            base: BaseInvoice::new(invoice_number, issue_date, seller, buyer, currency),
            due_date,
            incoterms,
            country_of_origin,
            hs_codes: HashMap::new(),
        }
    }

    pub fn add_item(&mut self, item: InvoiceItem) {
        self.base.add_item(item);
    }

    pub fn add_hs_code(&mut self, item_name: String, hs_code: String) {
        self.hs_codes.insert(item_name, hs_code);
    }
}