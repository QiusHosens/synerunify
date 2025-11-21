"""
图片转SVG相关的 Pydantic 模型
用于请求和响应的数据校验
"""
from pydantic import BaseModel, Field
from typing import Optional


class ConvertImageToSvgRequest(BaseModel):
    """图片转SVG请求模型（通过路径）"""
    file_path: str = Field(..., description="MinIO文件路径")
    white_threshold: Optional[int] = Field(240, description="白色阈值 (0-255)，超过此值被认为是白色")
    min_area: Optional[int] = Field(100, description="最小区域面积，小于此值的区域将被忽略")
    stroke_width: Optional[int] = Field(2, description="描边宽度（像素）")
    sharpen_factor: Optional[float] = Field(2.0, description="锐化因子，值越大锐化效果越强")
    enable_upscale: Optional[bool] = Field(True, description="是否启用图片放大（默认True）")
    enable_sharpen: Optional[bool] = Field(True, description="是否启用图片锐化（默认True）")


class ConvertImageToSvgResponse(BaseModel):
    """图片转SVG响应模型"""
    code: int = Field(200, description="响应状态码")
    svg_content: Optional[str] = Field(None, description="SVG字符串内容")
    metadata: Optional[dict] = Field(None, description="处理元数据（尺寸、区域数量等）")
    message: Optional[str] = Field(None, description="错误信息")

