import io
import os

import fitz  # PyMuPDF
import pytesseract
from flask import Flask, jsonify, request
from minio.error import S3Error
from PIL import Image

from src import config  # noqa: F401  # 确保 .env 被加载
from src.utils.minio_util import download_from_minio
from src.utils.ocr_detection_util import parse_document

app = Flask(__name__)

FLASK_PORT = int(os.getenv("FLASK_PORT", "8080"))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

@app.route('/process/process_image', methods=['POST'])
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

@app.route('/process/process_image_path', methods=['POST'])
def process_image_path():
    # 检查请求中是否包含文件路径
    if not request.json or 'file_path' not in request.json:
        return jsonify({'error': 'No file_path provided'}), 400

    file_path = request.json['file_path']
    config = request.form.get('config', None)

    try:
        # 从 MinIO 获取文件
        file_data, file_ext = download_from_minio(file_path)

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

@app.route('/process/parse_document', methods=['POST'])
def parse_document_endpoint():
    """
    Parse document (invoice) and perform OCR recognition
    
    Request body (JSON):
    {
        "source_file": "bucket/object/path",  # MinIO source file path
        "output_dir": "bucket/output/path"     # MinIO output directory path
    }
    
    Returns:
        JSON response with OCR results including:
        - results: List of OCR recognition results
        - output_files: List of uploaded file paths
        - error: Error message if any
    """
    # Check if request contains JSON data
    if not request.json:
        return jsonify({'code': 400, 'message': 'No JSON data provided'}), 400
    
    # Get required parameters
    source_file = request.json.get('source_file')
    output_dir = request.json.get('output_dir')
    
    # Validate required parameters
    if not source_file:
        return jsonify({'code': 400, 'message': 'Missing required parameter: source_file'}), 400
    
    if not output_dir:
        return jsonify({'code': 400, 'message': 'Missing required parameter: output_dir'}), 400
    
    try:
        # Call parse_document function
        result = parse_document(source_file=source_file, output_dir=output_dir)

        return jsonify({
            'code': 200,
            'data': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f"Failed to parse document: {str(e)}",
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=FLASK_DEBUG)