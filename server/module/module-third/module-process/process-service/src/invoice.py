import re
from pdfminer.high_level import extract_text
from datetime import datetime
from typing import List, Dict

class PartyInfo:
    """购买方/销售方信息"""
    def __init__(self, name: str, tax_id: str):
        self.name = name
        self.tax_id = tax_id

class InvoiceItem:
    """发票明细项类"""
    def __init__(self, name: str, model: str, unit: str, quantity: int, unit_price: float, amount: float, tax_rate: float, tax_amount: float):
        self.name = name                # 项目名称
        self.model = model              # 规格型号
        self.unit = unit                # 单位
        self.quantity = quantity        # 数量
        self.unit_price = unit_price    # 单价
        self.amount = amount            # 金额
        self.tax_rate = tax_rate        # 税率/征收率
        self.tax_amount = tax_amount    # 税额

    def get_total(self) -> float:
        """计算明细项总价"""
        return self.quantity * self.unit_price

class Invoice:
    """发票类"""
    def __init__(self, invoice_id: str, customer_name: str, issue_date: datetime = None):
        self.invoice_id = invoice_id          # 发票编号
        self.customer_name = customer_name    # 客户名称
        self.issue_date = issue_date or datetime.now()  # 开票日期，默认为当前时间
        self.items: List[InvoiceItem] = []    # 发票明细项列表
        self.tax_rate: float = 0.13           # 税率，示例为13%

    def add_item(self, description: str, quantity: int, unit_price: float):
        """添加发票明细项"""
        item = InvoiceItem(description, quantity, unit_price)
        self.items.append(item)

    def get_subtotal(self) -> float:
        """计算小计（不含税）"""
        return sum(item.get_total() for item in self.items)

    def get_tax(self) -> float:
        """计算税额"""
        return self.get_subtotal() * self.tax_rate

    def get_total(self) -> float:
        """计算总计（含税）"""
        return self.get_subtotal() + self.get_tax()

    def to_dict(self) -> Dict:
        """将发票对象转换为字典，便于序列化或打印"""
        return {
            "invoice_id": self.invoice_id,
            "customer_name": self.customer_name,
            "issue_date": self.issue_date.strftime("%Y-%m-%d %H:%M:%S"),
            "items": [
                {
                    "description": item.description,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "total": item.get_total()
                } for item in self.items
            ],
            "subtotal": self.get_subtotal(),
            "tax": self.get_tax(),
            "total": self.get_total()
        }

def parse_invoice_title(text):
    """解析发票标题"""
    # 先解析首行,如果包含发票
    pattern_invoice_title = r'\s*(.*?)\n'
    match = re.search(pattern_invoice_title, text, re.DOTALL)
    if match:
        invoice_title = match.group(1).strip().replace('\n', '')
        if "发票" in invoice_title:
            return invoice_title
    # 正则匹配表达式,从空格或冒号后开始,非贪婪匹配任意非空格、非制表符、非换行符、非冒号的字符,直到“发票”
    pattern_invoice_title = r'(?:\s+|[:：])(?:[^ \t\n:：]*?发票(?:|$))'
    matches = re.findall(pattern_invoice_title, text, re.MULTILINE | re.DOTALL)
    # match = re.search(pattern_invoice_title, text, re.DOTALL)
    # print(f"pattern invoice title: {matches}")
    if len(matches) > 0:
        invoice_title = matches[0].strip().replace('\n', '').replace(':', '').replace('：', '')
        # print(f"invoice title: {invoice_title}")
        return invoice_title
    else:
        return None

def parse_invoice(text):
    # 获取title
    invoice_title = parse_invoice_title(text)
    print(f"invoice title: {invoice_title}")