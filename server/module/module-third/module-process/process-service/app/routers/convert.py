"""
图片转SVG相关的 API 路由
"""
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form

from app.models.convert import (
    ConvertImageToSvgRequest,
    ConvertImageToSvgResponse,
)
from app.service.convert_svg import (
    convert_image_bytes_to_svg,
    convert_image_from_minio_to_svg,
)

router = APIRouter(prefix="/process/convert", tags=["convert"])


@router.post("/image_to_svg", response_model=ConvertImageToSvgResponse)
async def convert_image_to_svg(
    image: UploadFile = File(..., description="上传的图片文件"),
    white_threshold: Optional[int] = Form(240, description="白色阈值 (0-255)"),
    min_area: Optional[int] = Form(100, description="最小区域面积"),
    stroke_width: Optional[int] = Form(2, description="描边宽度（像素）"),
    sharpen_factor: Optional[float] = Form(2.0, description="锐化因子"),
    enable_upscale: Optional[bool] = Form(True, description="是否启用图片放大"),
    enable_sharpen: Optional[bool] = Form(True, description="是否启用图片锐化")
):
    """
    将上传的图片转换为SVG格式
    
    Args:
        image: 上传的图片文件
        white_threshold: 白色阈值 (0-255)，超过此值被认为是白色
        min_area: 最小区域面积，小于此值的区域将被忽略
        stroke_width: 描边宽度（像素）
        sharpen_factor: 锐化因子，值越大锐化效果越强
        enable_upscale: 是否启用图片放大（默认True）
        enable_sharpen: 是否启用图片锐化（默认True）
        
    Returns:
        包含SVG内容和元数据的响应
    """
    # 读取上传的文件
    file_content = await image.read()
    
    # 调用服务层函数
    return convert_image_bytes_to_svg(
        image_bytes=file_content,
        white_threshold=white_threshold or 240,
        min_area=min_area or 100,
        stroke_width=stroke_width or 2,
        sharpen_factor=sharpen_factor or 2.0,
        enable_upscale=enable_upscale if enable_upscale is not None else True,
        enable_sharpen=enable_sharpen if enable_sharpen is not None else True
    )


@router.post("/image_to_svg_path", response_model=ConvertImageToSvgResponse)
async def convert_image_to_svg_path(request: ConvertImageToSvgRequest):
    """
    通过MinIO路径将图片转换为SVG格式
    
    Args:
        request: 包含文件路径和转换参数的请求体
        
    Returns:
        包含SVG内容和元数据的响应
    """
    # 调用服务层函数
    return convert_image_from_minio_to_svg(
        file_path=request.file_path,
        white_threshold=request.white_threshold or 240,
        min_area=request.min_area or 100,
        stroke_width=request.stroke_width or 2,
        sharpen_factor=request.sharpen_factor or 2.0,
        enable_upscale=request.enable_upscale if request.enable_upscale is not None else True,
        enable_sharpen=request.enable_sharpen if request.enable_sharpen is not None else True
    )

