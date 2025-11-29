"""
外观评分相关的 Pydantic 模型
用于请求和响应的数据校验
"""
from pydantic import BaseModel, Field
from typing import Optional


class AppearancePredictResponse(BaseModel):
    """外观评分预测响应模型"""
    code: int = Field(200, description="响应状态码")
    data: Optional[dict] = Field(None, description="数据（尺寸、区域数量等）")
    message: Optional[str] = Field(None, description="错误信息")

