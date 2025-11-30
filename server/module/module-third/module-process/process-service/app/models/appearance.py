"""
外观评分相关的 Pydantic 模型
用于请求和响应的数据校验
"""
from pydantic import BaseModel, Field
from typing import Optional, List


class FaceRegion(BaseModel):
    """人脸检测区域模型"""
    x1: int = Field(..., description="左上角x坐标")
    y1: int = Field(..., description="左上角y坐标")
    x2: int = Field(..., description="右下角x坐标")
    y2: int = Field(..., description="右下角y坐标")
    width: int = Field(..., description="区域宽度")
    height: int = Field(..., description="区域高度")


class FaceRegionWithScore(BaseModel):
    """带评分的人脸区域模型"""
    region: FaceRegion = Field(..., description="人脸区域")
    score: float = Field(..., description="外观评分")


class AppearancePredictResponse(BaseModel):
    """外观评分预测响应模型"""
    code: int = Field(200, description="响应状态码")
    data: Optional[dict] = Field(None, description="数据（分数、人脸区域等）")
    message: Optional[str] = Field(None, description="错误信息")


class DetectFacesResponse(BaseModel):
    """多人脸检测响应模型"""
    code: int = Field(200, description="响应状态码")
    data: Optional[dict] = Field(None, description="数据（人脸区域列表等）")
    message: Optional[str] = Field(None, description="错误信息")


class PredictAllResponse(BaseModel):
    """所有人脸预测响应模型"""
    code: int = Field(200, description="响应状态码")
    data: Optional[dict] = Field(None, description="数据（所有人脸区域及评分等）")
    message: Optional[str] = Field(None, description="错误信息")

