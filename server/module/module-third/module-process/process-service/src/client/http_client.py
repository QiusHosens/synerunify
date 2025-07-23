import requests
import os
import fitz
import io

def upload_image(image_path, url='http://39.102.215.118:40050/process_image'):
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

def upload_image_byte(image_byte, url='http://39.102.215.118:40050/process_image'):
    files = {'image': image_byte}
    response = requests.post(url, files=files)

    # Print raw response for debugging
    print("Status Code:", response.status_code)
    print("Response Headers:", response.headers)
    print("Raw Response:", response.text)

    if response.status_code == 200:
        print("识别结果:", response.json()['text'])
    else:
        print("错误:", response.json()['error'])

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
            upload_image_byte(img_byte_arr)
            # binary_images.append(img_byte_arr)

            # 保存图片
            # pix.save(os.path.join(output_dir, f"{file_name}_{page_num+1}.png"))

        print(f"Successfully converted {len(doc)} pages to images.")
        doc.close()
    except Exception as e:
        print(f"Error during conversion: {e}")

    # upload_image(os.path.join(output_dir, '1_发票27.0元.pdf_1.png'))