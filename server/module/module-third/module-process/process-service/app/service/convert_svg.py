"""
图片转SVG服务模块
提供图片转SVG的业务逻辑处理
"""
import os
from typing import Optional, Tuple

from minio.error import S3Error

from src.utils.minio_util import download_from_minio
from src.utils.svg_utils import process_image_bytes_to_svg_string
from app.models.convert import ConvertImageToSvgResponse


def convert_image_bytes_to_svg(
    image_bytes: bytes,
    white_threshold: int = 240,
    min_area: int = 100,
    stroke_width: int = 2,
    sharpen_factor: float = 2.0,
    enable_upscale: bool = True,
    enable_sharpen: bool = True
) -> ConvertImageToSvgResponse:
    """
    将图片字节数据转换为SVG格式
    
    Args:
        image_bytes: 图片字节数据
        white_threshold: 白色阈值 (0-255)，超过此值被认为是白色
        min_area: 最小区域面积，小于此值的区域将被忽略
        stroke_width: 描边宽度（像素）
        sharpen_factor: 锐化因子，值越大锐化效果越强
        enable_upscale: 是否启用图片放大（默认True）
        enable_sharpen: 是否启用图片锐化（默认True）
        
    Returns:
        ConvertImageToSvgResponse 响应对象
    """
    try:
        # 调用转换函数
        result = process_image_bytes_to_svg_string(
            image_bytes=image_bytes,
            white_threshold=white_threshold,
            min_area=min_area,
            stroke_width=stroke_width,
            sharpen_factor=sharpen_factor,
            enable_upscale=enable_upscale,
            enable_sharpen=enable_sharpen
        )
        
        if result is None:
            return ConvertImageToSvgResponse(
                code=500,
                message="Failed to convert image to SVG"
            )
        
        svg_content, metadata = result
        return ConvertImageToSvgResponse(
            code=200,
            svg_content=svg_content,
            metadata=metadata
        )
        
    except Exception as e:
        return ConvertImageToSvgResponse(
            code=500,
            message=f"Failed to convert image to SVG: {str(e)}"
        )


def convert_image_from_minio_to_svg(
    file_path: str,
    white_threshold: int = 240,
    min_area: int = 100,
    stroke_width: int = 2,
    sharpen_factor: float = 2.0,
    enable_upscale: bool = True,
    enable_sharpen: bool = True
) -> ConvertImageToSvgResponse:
    """
    从MinIO路径读取图片并转换为SVG格式
    
    Args:
        file_path: MinIO文件路径
        white_threshold: 白色阈值 (0-255)，超过此值被认为是白色
        min_area: 最小区域面积，小于此值的区域将被忽略
        stroke_width: 描边宽度（像素）
        sharpen_factor: 锐化因子，值越大锐化效果越强
        enable_upscale: 是否启用图片放大（默认True）
        enable_sharpen: 是否启用图片锐化（默认True）
        
    Returns:
        ConvertImageToSvgResponse 响应对象
    """
    try:
        # 从 MinIO 获取文件
        file_data, file_ext = download_from_minio(file_path)
        
        # 判断文件类型（只支持图片格式）
        file_extension = os.path.splitext(file_path)[1].lower()
        if file_extension not in ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']:
            return ConvertImageToSvgResponse(
                code=400,
                message="Unsupported file type. Only image files are supported."
            )
        
        # 调用转换函数
        result = process_image_bytes_to_svg_string(
            image_bytes=file_data,
            white_threshold=white_threshold,
            min_area=min_area,
            stroke_width=stroke_width,
            sharpen_factor=sharpen_factor,
            enable_upscale=enable_upscale,
            enable_sharpen=enable_sharpen
        )
        
        if result is None:
            return ConvertImageToSvgResponse(
                code=500,
                message="Failed to convert image to SVG"
            )
        
        svg_content, metadata = result
        return ConvertImageToSvgResponse(
            code=200,
            svg_content=svg_content,
            metadata=metadata
        )
        
    except S3Error as e:
        return ConvertImageToSvgResponse(
            code=500,
            message=f"MinIO error: {str(e)}"
        )
    except Exception as e:
        return ConvertImageToSvgResponse(
            code=500,
            message=f"Failed to convert image to SVG: {str(e)}"
        )

