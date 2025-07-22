import re
from pdfminer.high_level import extract_text
from datetime import datetime
from typing import List, Dict
from enum import Enum

class InvoicePattern:
    def __init__(self):
        self.pattern_invoice_id = r'发票号码[:：]\s*(\d+)'
        self.pattern_issue_date = r'开票日期[:：]\s*(\d{4}年\d{2}月\d{2}日)'
        self.pattern_buyer_name = r'购\s*买\s*方\s*信\s*息.*?名\s*称[:：]\s*(.*?)(?:\n|$)'
        self.pattern_buyer_tax_id = r'纳税人识别号[:：]\s*(.*?)(?:\n|$)?'
        self.pattern_seller_name = r'销\s*售\s*方\s*信\s*息.*?名\s*称[:：]\s*(.*?)(?:\n|$)'
        self.pattern_seller_tax_id = r'销\s*售\s*方\s*信\s*息.*?纳税人识别号[:：]\s*(.*?)(?:\n|$)?'
        self.pattern_item_name = r'项目名称\s*(.*?)(?:\n|$)'
        self.pattern_item_model = r'规格型号\s*(.*?)(?:\n|$)'
        self.pattern_item_unit = r'单位\s*(.*?)(?:\n|$)'
        self.pattern_item_quantity = r'数\s*量\s*([\d.]+)'
        self.pattern_item_unit_price = r'单\s*价\s*([\d.]+)'
        self.pattern_item_amount = r'金\s*额\s*(?:税率/征收率\s*)?([\d.]+)'
        self.pattern_item_tax_rate = r'税率/征收率\s*(\d+%|\d*\.?\d*%)'
        self.pattern_item_tax_amount = r'税\s*额\s*([\d.]+)'
        self.pattern_total_amount = r'¥([\d.]+)'
        self.pattern_total_amount_text = r'价税合计\(大写\)\s*(.*?)(?:\n|$)'
        self.pattern_issuer = r'开票人[:：]\s*(.*?)(?:\n|$)'

    def match_by_pattern(self, text: str, pattern: str) -> str:
        try:
            match = re.search(pattern, text, re.DOTALL | re.MULTILINE)
            return match.group(1).strip() if match else None
        except Exception as e:
            print(f"Pattern matching error: {e}")
            return None

class ElectronicInvoicePattern(InvoicePattern):
    def __init__(self):
        super().__init__()

class InvoiceType(Enum):
    VAT_SPECIAL = "vat_special"
    VAT_ORDINARY = "vat_ordinary"
    VAT_ELECTRONIC_SPECIAL = "vat_electronic_special"
    VAT_ELECTRONIC_ORDINARY = "vat_electronic_ordinary"
    FULL_ELECTRONIC = "full_electronic"
    VAT_ROLL = "vat_roll"
    BLOCKCHAIN = "blockchain"

class PartyInfo:
    def __init__(self, name: str, tax_id: str):
        self.name = name or "N/A"
        self.tax_id = tax_id or "N/A"

class InvoiceItem:
    def __init__(self, name: str, model: str, unit: str, quantity: int,
                 unit_price: float, amount: float, tax_rate: float, tax_amount: float):
        self.name = name or "N/A"
        self.model = model or ""
        self.unit = unit or ""
        self.quantity = int(quantity) if quantity else 0
        self.unit_price = float(unit_price) if unit_price else 0.0
        self.amount = float(amount) if amount else 0.0
        self.tax_rate = float(tax_rate.strip('%'))/100 if tax_rate else 0.0
        self.tax_amount = float(tax_amount) if tax_amount else 0.0

    def get_total(self) -> float:
        return self.quantity * self.unit_price

class Invoice:
    def __init__(self, invoice_id: str, issue_date: datetime = None,
                 buyer: PartyInfo = None, seller: PartyInfo = None):
        self.invoice_id = invoice_id or "N/A"
        self.issue_date = issue_date or datetime.now()
        self.buyer = buyer
        self.seller = seller
        self.items: List[InvoiceItem] = []
        self.tax_rate: float = 0.13
        self.issuer: str = ""

    def add_item(self, item: InvoiceItem):
        self.items.append(item)

    def get_subtotal(self) -> float:
        return sum(item.get_total() for item in self.items)

    def get_tax(self) -> float:
        return self.get_subtotal() * self.tax_rate

    def get_total(self) -> float:
        return self.get_subtotal() + self.get_tax()

    def to_dict(self) -> Dict:
        return {
            "invoice_id": self.invoice_id,
            "issue_date": self.issue_date.strftime("%Y-%m-%d"),
            "buyer": {"name": self.buyer.name, "tax_id": self.buyer.tax_id} if self.buyer else {},
            "seller": {"name": self.seller.name, "tax_id": self.seller.tax_id} if self.seller else {},
            "items": [
                {
                    "name": item.name,
                    "model": item.model,
                    "unit": item.unit,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "amount": item.amount,
                    "tax_rate": item.tax_rate,
                    "tax_amount": item.tax_amount,
                    "total": item.get_total()
                } for item in self.items
            ],
            "subtotal": self.get_subtotal(),
            "tax": self.get_tax(),
            "total": self.get_total(),
            "issuer": self.issuer
        }

class VatElectronicOrdinaryInvoice(Invoice):
    def __init__(self, text: str):
        pattern = ElectronicInvoicePattern()

        invoice_id = pattern.match_by_pattern(text, pattern.pattern_invoice_id)
        issue_date_str = pattern.match_by_pattern(text, pattern.pattern_issue_date)
        buyer_name = pattern.match_by_pattern(text, pattern.pattern_buyer_name)
        buyer_tax_id = pattern.match_by_pattern(text, pattern.pattern_buyer_tax_id)
        seller_name = pattern.match_by_pattern(text, pattern.pattern_seller_name)
        seller_tax_id = pattern.match_by_pattern(text, pattern.pattern_seller_tax_id)

        # Convert date string to datetime
        issue_date = None
        if issue_date_str:
            try:
                issue_date = datetime.strptime(issue_date_str, "%Y年%m月%d日")
            except ValueError:
                print(f"Date parsing error: {issue_date_str}")

        buyer = PartyInfo(buyer_name, buyer_tax_id)
        seller = PartyInfo(seller_name, seller_tax_id)

        super().__init__(invoice_id, issue_date, buyer, seller)

        # Extract item details
        item_name = pattern.match_by_pattern(text, pattern.pattern_item_name)
        item_model = pattern.match_by_pattern(text, pattern.pattern_item_model)
        item_unit = pattern.match_by_pattern(text, pattern.pattern_item_unit)
        item_quantity = pattern.match_by_pattern(text, pattern.pattern_item_quantity)
        item_unit_price = pattern.match_by_pattern(text, pattern.pattern_item_unit_price)
        item_amount = pattern.match_by_pattern(text, pattern.pattern_item_amount)
        item_tax_rate = pattern.match_by_pattern(text, pattern.pattern_item_tax_rate)
        item_tax_amount = pattern.match_by_pattern(text, pattern.pattern_item_tax_amount)

        if item_name and item_quantity and item_unit_price:
            item = InvoiceItem(
                item_name, item_model, item_unit, item_quantity,
                item_unit_price, item_amount, item_tax_rate, item_tax_amount
            )
            self.add_item(item)

        self.total_amount = pattern.match_by_pattern(text, pattern.pattern_total_amount)
        self.total_amount_text = pattern.match_by_pattern(text, pattern.pattern_total_amount_text)
        self.issuer = pattern.match_by_pattern(text, pattern.pattern_issuer)

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

def parse_invoice_type(title: str) -> InvoiceType:
    if not title:
        return None
    title = title.lower()
    if "普通发票" in title and "电子" in title:
        return InvoiceType.VAT_ELECTRONIC_ORDINARY
    elif "专用发票" in title and "电子" in title:
        return InvoiceType.VAT_ELECTRONIC_SPECIAL
    elif "普通发票" in title:
        return InvoiceType.VAT_ORDINARY
    elif "专用发票" in title:
        return InvoiceType.VAT_SPECIAL
    elif "全电发票" in title:
        return InvoiceType.FULL_ELECTRONIC
    elif "卷式" in title:
        return InvoiceType.VAT_ROLL
    elif "区块链" in title:
        return InvoiceType.BLOCKCHAIN
    return None

def parse_invoice(text: str) -> Invoice:
    invoice_title = parse_invoice_title(text)
    print(f"invoice title: {invoice_title}")
    if not invoice_title:
        print("Could not parse invoice title")
        # raise ValueError("Could not parse invoice title")

    invoice_type = parse_invoice_type(invoice_title)
    if invoice_type == InvoiceType.VAT_ELECTRONIC_ORDINARY:
        invoice = VatElectronicOrdinaryInvoice(text)
        print(f"invoice: {invoice.to_dict()}")
    else:
        print(f"Unsupported invoice type: {invoice_type}")
        # raise ValueError(f"Unsupported invoice type: {invoice_type}")