"""
外观评分服务模块
提供图片外观评分预测功能
"""
import io
import os
from typing import Optional
from pathlib import Path

import torch
from fastapi import HTTPException
from PIL import Image

from app.appearance.predict import (
    get_model,
    load_model,
    data_transform,
    device
)
from app.models.appearance import AppearancePredictResponse

# 全局模型缓存
_model_cache: Optional[torch.nn.Module] = None
_model_path: Optional[str] = None


def get_cached_model(model_path: Optional[str] = None) -> torch.nn.Module:
    """
    获取缓存的模型，如果未加载或路径不同则重新加载
    
    Args:
        model_path: 模型文件路径，如果为None则使用默认路径
        
    Returns:
        加载好的模型
    """
    global _model_cache, _model_path
    
    # 默认模型路径
    if model_path is None:
        # 从appearance目录查找模型文件
        appearance_dir = Path(__file__).parent.parent / "appearance"
        default_model = appearance_dir / "models" / "final_best_model_full.pth"
        model_path = str(default_model)
    
    # 如果模型已加载且路径相同，直接返回
    if _model_cache is not None and _model_path == model_path:
        return _model_cache
    
    # 检查模型文件是否存在
    if not os.path.exists(model_path):
        raise HTTPException(
            status_code=404,
            detail=f"模型文件不存在: {model_path}"
        )
    
    try:
        # 加载模型
        _model_cache = load_model(model_path, use_full_model=None)
        _model_path = model_path
        return _model_cache
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"模型加载失败: {str(e)}"
        )


def predict_image_from_bytes(
    image_bytes: bytes,
    model_path: Optional[str] = None
) -> AppearancePredictResponse:
    """
    从图片字节数据预测外观得分
    
    Args:
        image_bytes: 图片字节数据
        model_path: 模型文件路径（可选，默认使用final_best_model_full.pth）
        
    Returns:
        包含预测得分的字典
    """
    try:
        # 加载模型
        model = get_cached_model(model_path)
        
        # 从字节数据加载图片
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # 预处理图片
        image_tensor = data_transform(image).unsqueeze(0).to(device)
        
        # 预测
        model.eval()
        with torch.no_grad():
            output = model(image_tensor)
            score = output.cpu().item()
        
        return AppearancePredictResponse(
            code=200,
            data={
                "score": float(score) * 20
            },
            message="预测成功"
        )
        
    except Exception as e:
        return AppearancePredictResponse(
            code=500,
            message=f"预测失败: {str(e)}"
        )

