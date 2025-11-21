"""
图片处理服务模块
提供OCR识别、文档解析等业务逻辑处理
"""
import io
import os
from typing import Optional

import fitz  # PyMuPDF
import pytesseract
from fastapi import HTTPException
from minio.error import S3Error
from PIL import Image

from src.utils.minio_util import download_from_minio
from src.utils.ocr_detection_util import parse_document
from app.models.process import (
    ProcessImagePathResponse,
    ParseDocumentResponse,
)


def process_image_bytes(
    image_bytes: bytes,
    config: Optional[str] = None
) -> dict:
    """
    处理图片字节数据，进行OCR识别
    
    Args:
        image_bytes: 图片字节数据
        config: OCR配置参数（可选）
        
    Returns:
        包含识别文本的字典
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        # 执行OCR识别
        if not config:
            text = pytesseract.image_to_string(img, lang='eng+chi_sim')
        else:
            text = pytesseract.image_to_string(img, lang='eng+chi_sim', config=config)
        
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def process_image_from_minio(
    file_path: str,
    config: Optional[str] = None
) -> ProcessImagePathResponse:
    """
    从MinIO路径读取图片并进行OCR识别
    
    Args:
        file_path: MinIO文件路径
        config: OCR配置参数（可选）
        
    Returns:
        ProcessImagePathResponse 响应对象
    """
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
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        return ProcessImagePathResponse(text=text)
        
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


def parse_document_service(
    source_file: str,
    output_dir: str
) -> ParseDocumentResponse:
    """
    解析文档（发票）并进行 OCR 识别
    
    Args:
        source_file: MinIO源文件路径
        output_dir: MinIO输出目录路径
        
    Returns:
        ParseDocumentResponse 响应对象
    """
    try:
        # 调用 parse_document 函数
        result = parse_document(source_file=source_file, output_dir=output_dir)
        
        if result is None:
            return ParseDocumentResponse(
                code=500,
                message="Failed to parse document"
            )
        
        return ParseDocumentResponse(
            code=200,
            data=result
        )
        
    except Exception as e:
        return ParseDocumentResponse(
            code=500,
            message=f"Failed to parse document: {str(e)}"
        )

