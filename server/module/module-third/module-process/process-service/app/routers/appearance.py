"""
外观评分相关的 API 路由
提供图片外观评分预测功能
"""
from typing import Optional

from fastapi import APIRouter, UploadFile, File, HTTPException, Query

from app.models.appearance import AppearancePredictResponse
from app.service.appearance import predict_image_from_bytes

router = APIRouter(prefix="/appearance", tags=["appearance"])


@router.post("/predict", response_model=AppearancePredictResponse)
async def predict_appearance(
    image: UploadFile = File(..., description="上传的图片文件"),
    model_path: Optional[str] = Query(None, description="模型文件路径（可选，默认使用final_best_model_full.pth）")
):
    """
    上传图片进行外观评分预测
    
    Args:
        image: 上传的图片文件
        model_path: 模型文件路径（可选，默认使用final_best_model_full.pth）
        
    Returns:
        包含预测得分的响应
    """
    # 验证文件类型
    if not image.content_type or not image.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="文件必须是图片格式"
        )
    
    # 读取上传的文件
    try:
        file_content = await image.read()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"读取文件失败: {str(e)}"
        )
    
    # 调用服务层函数进行预测
    return predict_image_from_bytes(
        image_bytes=file_content,
        model_path=model_path
    )

