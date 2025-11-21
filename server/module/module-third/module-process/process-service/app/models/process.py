"""
处理相关的 Pydantic 模型
用于请求和响应的数据校验
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class ProcessImageResponse(BaseModel):
    """处理图片响应模型"""
    text: str = Field(..., description="OCR识别的文本内容")


class ProcessImagePathRequest(BaseModel):
    """通过路径处理图片请求模型"""
    file_path: str = Field(..., description="MinIO文件路径")
    config: Optional[str] = Field(None, description="OCR配置参数")


class ProcessImagePathResponse(BaseModel):
    """通过路径处理图片响应模型"""
    text: str = Field(..., description="OCR识别的文本内容")


class ParseDocumentRequest(BaseModel):
    """解析文档请求模型"""
    source_file: str = Field(..., description="MinIO源文件路径")
    output_dir: str = Field(..., description="MinIO输出目录路径")


class ParseDocumentResponse(BaseModel):
    """解析文档响应模型"""
    code: int = Field(200, description="响应状态码")
    data: Optional[dict] = Field(None, description="解析结果数据")
    message: Optional[str] = Field(None, description="错误信息")

