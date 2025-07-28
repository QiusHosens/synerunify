from flask import Flask, jsonify, request
from minio import Minio
from minio.error import S3Error
import fitz  # PyMuPDF
from PIL import Image
import io
import pytesseract
import os

app = Flask(__name__)

# MinIO 配置
MINIO_ENDPOINT = "your-minio-endpoint:9000"  # 替换为你的 MinIO 地址
MINIO_ACCESS_KEY = "your-access-key"  # 替换为你的 MinIO 访问密钥
MINIO_SECRET_KEY = "your-secret-key"  # 替换为你的 MinIO 密钥
MINIO_BUCKET = "your-bucket-name"  # 替换为你的 MinIO 存储桶名称
minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False  # 根据需要设置为 True（HTTPS）或 False（HTTP）
)

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    config = request.form.get('config', None)

    try:
        img = Image.open(file.stream)
        text = ""
        if not config:
            text += pytesseract.image_to_string(img, lang='eng+chi_sim')
        else:
            text += pytesseract.image_to_string(img, lang='eng+chi_sim', config=config)
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process_image_path', methods=['POST'])
def process_image_path():
    # 检查请求中是否包含文件路径
    if not request.json or 'file_path' not in request.json:
        return jsonify({'error': 'No file_path provided'}), 400

    file_path = request.json['file_path']
    config = request.form.get('config', None)

    try:
        # 从 MinIO 获取文件
        response = minio_client.get_object(MINIO_BUCKET, file_path)
        file_data = response.read()
        response.close()
        response.release_conn()

        # 将文件数据转为 BinaryIO
        file_stream = io.BytesIO(file_data)

        # 判断文件类型（基于扩展名）
        file_extension = os.path.splitext(file_path)[1].lower()
        text = ""

        if file_extension == '.pdf':
            # 使用 PyMuPDF 处理 PDF
            doc = fitz.open(stream=file_stream, filetype="pdf")
            for page_num in range(len(doc)):
                page = doc[page_num]
                pix = page.get_pixmap(dpi=300)  # 转换为图片
                img_data = pix.tobytes("png")
                img = Image.open(io.BytesIO(img_data))
                # OCR 识别，累加每页的文本
                if not config:
                    text += pytesseract.image_to_string(img, lang='eng+chi_sim')
                else:
                    text += pytesseract.image_to_string(img, lang='eng+chi_sim', config=config)
            doc.close()
        elif file_extension in ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']:
            # 直接处理图片
            img = Image.open(file_stream)
            if not config:
                text += pytesseract.image_to_string(img, lang='eng+chi_sim')
            else:
                text += pytesseract.image_to_string(img, lang='eng+chi_sim', config=config)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400

        return jsonify({'text': text})

    except S3Error as e:
        return jsonify({'error': f"MinIO error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({'error': f"Processing error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)