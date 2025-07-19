import re
from pdfminer.high_level import extract_text


# 定义解析函数
def parse_invoice(text):
    invoice_data = {}

    # 使用正则表达式提取关键字段
    patterns = {
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
    text = extract_text("invoice_personal_normal.pdf")
    print(text)

    # 解析发票
    result = parse_invoice(text)

    # 输出结果
    for key, value in result.items():
        print(f"{key}: {value}")
