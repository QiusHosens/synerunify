"""
处理相关的 API 路由
包括图片处理、文档解析等功能
"""
import io
import os
from typing import Optional

import fitz  # PyMuPDF
import pytesseract
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from minio.error import S3Error
from PIL import Image

from app.core.config import settings
from app.models.process import (
    ProcessImagePathRequest,
    ProcessImagePathResponse,
    ParseDocumentRequest,
    ParseDocumentResponse,
)
from src.utils.minio_util import download_from_minio
from src.utils.ocr_detection_util import parse_document

router = APIRouter(prefix="/process", tags=["process"])


@router.post("/process_image", response_model=dict)
async def process_image(
    image: UploadFile = File(..., description="上传的图片文件"),
    config: Optional[str] = Form(None, description="OCR配置参数")
):
    """
    处理上传的图片文件，进行OCR识别
    
    Args:
        image: 上传的图片文件
        config: OCR配置参数（可选）
        
    Returns:
        包含识别文本的JSON响应
    """
    try:
        # 读取上传的文件
        file_content = await image.read()
        img = Image.open(io.BytesIO(file_content))
        
        # 执行OCR识别
        if not config:
            text = pytesseract.image_to_string(img, lang='eng+chi_sim')
        else:
            text = pytesseract.image_to_string(img, lang='eng+chi_sim', config=config)
        
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/process_image_path", response_model=ProcessImagePathResponse)
async def process_image_path(request: ProcessImagePathRequest):
    """
    通过MinIO路径处理图片文件，进行OCR识别
    
    Args:
        request: 包含文件路径的请求体
        
    Returns:
        包含识别文本的响应
    """
    file_path = request.file_path
    config = request.config
    
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


@router.post("/parse_document", response_model=ParseDocumentResponse)
async def parse_document_endpoint(request: ParseDocumentRequest):
    """
    解析文档（发票）并进行 OCR 识别
    
    Args:
        request: 包含源文件路径和输出目录的请求体
        
    Returns:
        包含OCR识别结果的响应
    """
    source_file = request.source_file
    output_dir = request.output_dir
    
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

