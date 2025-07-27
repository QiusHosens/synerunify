import requests
import os
import fitz
import io
import re

from src.entity.vat_invoice import VatInvoice


def upload_image(image_path, url='http://www.synerunify.com:40050/process_image'):
    with open(image_path, 'rb') as image_file:
        files = {'image': image_file}
        response = requests.post(url, files=files)

    # Print raw response for debugging
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Raw Response:", response.text)

    if response.status_code == 200:
        print("识别结果:", response.json()['text'])
    else:
        print("错误:", response.json()['error'])

def upload_image_byte(image_byte, url='http://www.synerunify.com:40050/process_image'):
    files = {'image': image_byte}
    # custom_config = '--oem 3 --psm 6'
    custom_config = '--oem 1 --psm 6'

    data = {'config': custom_config}
    response = requests.post(url, files=files, data=data)

    # Print raw response for debugging
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Raw Response:", response.text)

    if response.status_code == 200:
        text = response.json()['text']
        print("识别结果:", text)
        return text
    else:
        print("错误:", response.json()['error'])
        return None

# 清理乱码，保留换行符
def clean_text(text):
    # 保留中文、字母、数字、常见标点和换行符
    cleaned_text = re.sub(r'[^\w\s,.!?，。！？:：%（）()\-\n]', '', text)
    # 去除多余的空白字符（保留换行符）
    lines = cleaned_text.split('\n')
    cleaned_lines = [' '.join(line.split()) for line in lines]
    cleaned_text = '\n'.join(cleaned_lines)
    return cleaned_text

if __name__ == '__main__':
    input_dir = '../../samples/'
    file_name = '1_发票27.0元.pdf'
    pdf_path = input_dir + file_name
    output_dir = input_dir + 'temp'

    # 创建输出目录（如果不存在）
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            pix = page.get_pixmap(dpi=300)

            # 将 pixmap 转为 BinaryIO
            img_byte_arr = io.BytesIO(pix.tobytes("png"))
            img_byte_arr.seek(0)
            result = upload_image_byte(img_byte_arr)
            clean_text = clean_text(result)
            print("clean text:", clean_text)
            vat_invoice = VatInvoice(clean_text)
            print(f"invoice: {vat_invoice.to_dict()}")

            # result = clean_text.replace(' ', '')
            # print("result:", result)
            # seg_list = jieba.cut(result, cut_all=False)
            # print("精确模式:", "/".join(seg_list))

            # binary_images.append(img_byte_arr)

            # 保存图片
            # pix.save(os.path.join(output_dir, f"{file_name}_{page_num+1}.png"))

        print(f"Successfully converted {len(doc)} pages to images.")
        doc.close()
    except Exception as e:
        print(f"Error during conversion: {e}")

    # upload_image(os.path.join(output_dir, '1_发票27.0元.pdf_1.png'))