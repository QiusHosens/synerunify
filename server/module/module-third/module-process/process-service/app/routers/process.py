"""
处理相关的 API 路由
包括图片处理、文档解析等功能
"""
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form

from app.models.process import (
    ProcessImagePathRequest,
    ProcessImagePathResponse,
    ParseDocumentRequest,
    ParseDocumentResponse,
)
from app.service.process import (
    process_image_bytes,
    process_image_from_minio,
    parse_document_service,
)

router = APIRouter(prefix="/process/detection", tags=["process"])


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
    # 读取上传的文件
    file_content = await image.read()
    
    # 调用服务层函数
    return process_image_bytes(image_bytes=file_content, config=config)


@router.post("/process_image_path", response_model=ProcessImagePathResponse)
async def process_image_path(request: ProcessImagePathRequest):
    """
    通过MinIO路径处理图片文件，进行OCR识别
    
    Args:
        request: 包含文件路径的请求体
        
    Returns:
        包含识别文本的响应
    """
    # 调用服务层函数
    return process_image_from_minio(
        file_path=request.file_path,
        config=request.config
    )


@router.post("/parse_document", response_model=ParseDocumentResponse)
async def parse_document_endpoint(request: ParseDocumentRequest):
    """
    解析文档（发票）并进行 OCR 识别
    
    Args:
        request: 包含源文件路径和输出目录的请求体
        
    Returns:
        包含OCR识别结果的响应
    """
    # 调用服务层函数
    return parse_document_service(
        source_file=request.source_file,
        output_dir=request.output_dir
    )

