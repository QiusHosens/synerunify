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
        self.name = name  # 项目名称
        self.model = model  # 规格型号
        self.unit = unit  # 单位
        self.quantity = quantity        # 数量
        self.unit_price = unit_price    # 单价
        self.amount = amount  # 金额
        self.tax_rate = tax_rate  # 税率/征收率
        self.tax_amount = tax_amount  # 税额

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

# 定义解析函数
def parse_invoice(text):
    invoice_data = {}

    # 使用正则表达式提取关键字段
    patterns = {
        'invoice_title': r'\s*(.*?)\n',
        'invoice_number': r'发票号码:\s*(\d+)',
        'issue_date': r'开票日期:\s*(\d{4}年\d{2}月\d{2}日)',
        'buyer_name': r'购\s*买\s*方\s*信\s*息.*?名\s*称:\s*(.*?)\n',
        'buyer_tax_id': r'统一社会信用代码/纳税人识别号:\s*(.*?)(?:\n|$)?',
        'seller_name': r'销\s*售\s*方\s*信\s*息.*?名\s*称:\s*(.*?)\n',
        'seller_tax_id': r'(?:统一社会信用代码/纳税人识别号:.*?){1}(?:统一社会信用代码/纳税人识别号:\s*(.*?)\n)',
        'item_name': r'项目名称\s*(.*?)\n\n',
        'item_model': r'规格型号\s*(.*?)\n',
        'unit': r'单位\s*(.*?)\n',
        'quantity': r'数\s*量\s*(\d+)',
        'unit_price': r'单\s*价\s*([\d.]+)',
        'amount': r'金\s*额\s*(?:税率/征收率\s*)?([\d.]+)',
        'tax_rate': r'税率/征收率\s*(?:[\d.]+\s*)(\d+%)',
        'tax_amount': r'税\s*额\s*([\d.]+)',
        'total_amount': r'¥([\d.]+)\n¥([\d.]+)\n¥([\d.]+)',
        'total_amount_text': r'价税合计\(大写\)\s*(.*?)\n',
        'order_number': r'订单号:(\d+)',
        'issuer': r'开票人:\s*(.*?)\n'
    }

    # 提取信息
    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.DOTALL)
        # print(f"{key}: {match}")
        if match:
            if key == 'total_amount':
                invoice_data['total_amount'] = match.group(1)
                invoice_data['amount_excl_tax'] = match.group(2)
                invoice_data['tax_total'] = match.group(3)
            else:
                invoice_data[key] = match.group(1).strip().replace('\n', '')
        else:
            invoice_data[key] = ''

    # 返回结构化数据
    return invoice_data


if __name__ == "__main__":
    text = extract_text("../samples/22_个人.pdf")
    # text = extract_text("../samples/1_发票27.0元.pdf")
    print(text)

    # 解析发票
    result = parse_invoice(text)

    # 输出结果
    for key, value in result.items():
        print(f"{key}: {value}")
