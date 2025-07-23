import re
from datetime import datetime
from typing import LiteralString, List, Dict

class InvoicePattern:
    def __init__(self):
        # 发票代码
        self.pattern_code = r'发\s*票\s*代\s*码\s*[:：]\s*(\d+)'
        # 发票号码
        self.pattern_number = r'发\s*票\s*号\s*码\s*[:：]\s*(\d+)'
        # 开票日期
        self.pattern_issue_date = r'开\s*票\s*日\s*期\s*[:：]\s*(\d{4}\s*年\s*\d{2}\s*月\s*\d{2}\s*日)'
        # 机器编号
        self.pattern_machine_number = r'机\s*器\s*编\s*号\s*[:：]\s*(\d+)'
        # 发票校验码
        self.pattern_check_code = r'校\s*验\s*码\s*[:：]\s*([\d\s]+)'

        # 名称
        self.pattern_name = r'名\s*称\s*[:：]\s*(.*?)(?=\s*\d*(?:\n|$))' # r'名\s*称\s*[:：]\s*(.*?)(?:\n|$)'
        # 纳税人识别号
        self.pattern_tax_id = r'纳\s*税\s*人\s*识\s*别\s*号\s*[:：]\s*([A-Za-z0-9]+)'
        # 地址电话
        self.pattern_address_phone = r'地\s*址\s*电\s*话\s*[:：]\s*(.*?)(?:\n|$)'
        # 开户行及账号
        self.pattern_bank_account = r'开\s*户\s*行\s*及\s*账\s*号\s*[:：]\s*(.*?)(?:\n|$)'

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

    def match_by_pattern(self, text: str, pattern: str) -> LiteralString | None:
        try:
            match = re.search(pattern, text, re.DOTALL | re.MULTILINE)
            return match.group(1).strip() if match else None
        except Exception as e:
            print(f"Pattern matching error: {e}")
            return None
    def multi_match_by_pattern(self, text: str, pattern: str) -> List:
        return re.findall(pattern, text, re.DOTALL | re.MULTILINE)

class PartyInfo:
    def __init__(self, name: str, tax_id: str, address_phone: str, bank_account: str):
        self.name = name or ""
        self.tax_id = tax_id or ""
        self.address_phone = address_phone or ""
        self.bank_account = bank_account or ""

class InvoiceItem:
    def __init__(self, name: str, model: str, unit: str, quantity: int,
                 unit_price: float, amount: float, tax_rate: float, tax_amount: float):
        self.name = name or ""
        self.model = model or ""
        self.unit = unit or ""
        self.quantity = int(quantity) if quantity else 0
        self.unit_price = float(unit_price) if unit_price else 0.0
        self.amount = float(amount) if amount else 0.0
        self.tax_rate = float(tax_rate.strip('%'))/100 if tax_rate else 0.0
        self.tax_amount = float(tax_amount) if tax_amount else 0.0

    def get_total(self) -> float:
        return self.quantity * self.unit_price

class VatInvoice:
    def __init__(self, text: str):
        pattern = InvoicePattern()

        code = pattern.match_by_pattern(text, pattern.pattern_code)
        number = pattern.match_by_pattern(text, pattern.pattern_number)
        machine_number = pattern.match_by_pattern(text, pattern.pattern_machine_number)
        check_code = pattern.match_by_pattern(text, pattern.pattern_check_code).replace(" ", "")
        issue_date_str = pattern.match_by_pattern(text, pattern.pattern_issue_date).replace(" ", "")

        names = pattern.multi_match_by_pattern(text, pattern.pattern_name)
        tax_ids = pattern.multi_match_by_pattern(text, pattern.pattern_tax_id)
        address_phones = pattern.multi_match_by_pattern(text, pattern.pattern_address_phone)
        bank_accounts = pattern.multi_match_by_pattern(text, pattern.pattern_bank_account)

        # print(f"names: {names}")
        # print(f"tax_ids: {tax_ids}")
        # print(f"address_phones: {address_phones}")
        # print(f"bank_accounts: {bank_accounts}")

        self.code = code
        self.number = number
        self.machine_number = machine_number
        self.check_code = check_code

        self.buyer = PartyInfo(names[0].replace(" ", ""), tax_ids[0], address_phones[0].replace(" ", ""), bank_accounts[0].replace(" ", ""))
        self.seller = PartyInfo(names[1].replace(" ", ""), tax_ids[1], address_phones[1].replace(" ", ""), bank_accounts[1].replace(" ", ""))

        # Convert date string to datetime
        issue_date = None
        if issue_date_str:
            try:
                issue_date = datetime.strptime(issue_date_str, "%Y年%m月%d日")
            except ValueError:
                print(f"Date parsing error: {issue_date_str}")
        self.issue_date = issue_date

        # buyer = PartyInfo(buyer_name, buyer_tax_id)
        # seller = PartyInfo(seller_name, seller_tax_id)
        #
        # super().__init__(invoice_id, issue_date, buyer, seller)

        # Extract item details
        item_name = pattern.match_by_pattern(text, pattern.pattern_item_name)
        item_model = pattern.match_by_pattern(text, pattern.pattern_item_model)
        item_unit = pattern.match_by_pattern(text, pattern.pattern_item_unit)
        item_quantity = pattern.match_by_pattern(text, pattern.pattern_item_quantity)
        item_unit_price = pattern.match_by_pattern(text, pattern.pattern_item_unit_price)
        item_amount = pattern.match_by_pattern(text, pattern.pattern_item_amount)
        item_tax_rate = pattern.match_by_pattern(text, pattern.pattern_item_tax_rate)
        item_tax_amount = pattern.match_by_pattern(text, pattern.pattern_item_tax_amount)

        # if item_name and item_quantity and item_unit_price:
        #     item = InvoiceItem(
        #         item_name, item_model, item_unit, item_quantity,
        #         item_unit_price, item_amount, item_tax_rate, item_tax_amount
        #     )
        #     self.add_item(item)

        self.total_amount = pattern.match_by_pattern(text, pattern.pattern_total_amount)
        self.total_amount_text = pattern.match_by_pattern(text, pattern.pattern_total_amount_text)
        self.issuer = pattern.match_by_pattern(text, pattern.pattern_issuer)

    def to_dict(self) -> Dict:
        return {
            "code": self.code,
            "number": self.number,
            "machine_number": self.machine_number,
            "check_code": self.check_code,
            "issue_date": self.issue_date.strftime("%Y-%m-%d"),
            "buyer": {"name": self.buyer.name, "tax_id": self.buyer.tax_id, "address_phone": self.buyer.address_phone, "bank_account": self.buyer.bank_account} if self.buyer else {},
            "seller": {"name": self.seller.name, "tax_id": self.seller.tax_id, "address_phone": self.seller.address_phone, "bank_account": self.seller.bank_account} if self.seller else {},
            # "items": [
            #     {
            #         "name": item.name,
            #         "model": item.model,
            #         "unit": item.unit,
            #         "quantity": item.quantity,
            #         "unit_price": item.unit_price,
            #         "amount": item.amount,
            #         "tax_rate": item.tax_rate,
            #         "tax_amount": item.tax_amount,
            #         "total": item.get_total()
            #     } for item in self.items
            # ],
            # "subtotal": self.get_subtotal(),
            # "tax": self.get_tax(),
            # "total": self.get_total(),
            "issuer": self.issuer
        }