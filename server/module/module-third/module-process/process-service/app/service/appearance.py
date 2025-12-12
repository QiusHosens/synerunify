"""
外观评分服务模块
提供图片外观评分预测功能
"""
import io
import os
from typing import Optional
from pathlib import Path
from datetime import datetime
from snowflake import SnowflakeGenerator

import torch
from fastapi import HTTPException
from PIL import Image

from app.appearance.predict import (
    get_model,
    load_model,
    data_transform,
    device,
    detect_face,
    detect_faces,
    crop_face_region
)
from app.models.appearance import (
    AppearancePredictResponse,
    DetectFacesResponse,
    PredictAllResponse,
    FaceRegion,
    FaceRegionWithScore
)

from src.utils.minio_util import upload_to_minio

# 全局模型缓存
_model_cache: Optional[torch.nn.Module] = None
_model_path: Optional[str] = None

generator = SnowflakeGenerator(1)

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
    model_path: Optional[str] = None,
    use_face_detection: bool = True,
    face_model_path: Optional[str] = None
) -> AppearancePredictResponse:
    """
    从图片字节数据预测外观得分
    
    Args:
        image_bytes: 图片字节数据
        model_path: 模型文件路径（可选，默认使用final_best_model_full.pth）
        use_face_detection: 是否使用人脸检测（默认True）
        face_model_path: 人脸检测模型路径（可选，默认使用yolov11l-face.pt）
        
    Returns:
        包含预测得分的字典
    """
    try:
        # 加载模型
        model = get_cached_model(model_path)
        
        # 从字节数据加载图片
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        original_width, original_height = image.size
        
        # 初始化人脸区域信息
        face_region = None
        
        # 如果启用人脸检测，先检测人脸并裁剪
        if use_face_detection:
            try:
                bbox = detect_face(image, face_model_path=face_model_path)
                if bbox:
                    # 保存人脸检测区域信息（原始图片坐标）
                    x1, y1, x2, y2 = bbox
                    face_region = {
                        "x1": int(x1),
                        "y1": int(y1),
                        "x2": int(x2),
                        "y2": int(y2),
                        "width": int(x2 - x1),
                        "height": int(y2 - y1)
                    }
                    # 裁剪人脸区域
                    image = crop_face_region(image, bbox)
                # 如果人脸检测失败,返回报错
                else:
                    print(f"未检测到人脸")
                    return AppearancePredictResponse(
                        code=500,
                        data={
                            "score": 0,
                            "region": None,
                            "size": {
                                "width": original_width,
                                "height": original_height
                            }
                        },
                        message=f"未检测到人脸"
                    )
            except Exception as e:
                # 如果人脸检测失败,返回报错
                print(f"人脸检测失败: {e}")
                return AppearancePredictResponse(
                    code=500,
                    data={
                        "score": 0,
                        "region": None,
                        "size": {
                            "width": original_width,
                            "height": original_height
                        }
                    },
                    message=f"未检测到人脸"
                )
        
        # 预处理图片
        image_tensor = data_transform(image).unsqueeze(0).to(device)
        
        # 预测
        model.eval()
        with torch.no_grad():
            output = model(image_tensor)
            score = output.cpu().item()
        
        # 构建响应数据
        response_data = {
            "score": float(score) * 20,
            "size": {
                "width": original_width,
                "height": original_height
            }
        }
        
        # 如果检测到人脸，添加人脸区域信息
        if face_region:
            response_data["region"] = face_region
        else:
            response_data["region"] = None
        
        return AppearancePredictResponse(
            code=200,
            data=response_data,
            message="预测成功"
        )
        
    except Exception as e:
        return AppearancePredictResponse(
            code=500,
            message=f"预测失败: {str(e)}"
        )


def detect_faces_from_bytes(
    image_bytes: bytes,
    face_model_path: Optional[str] = None,
    conf_threshold: float = 0.5
) -> DetectFacesResponse:
    """
    从图片字节数据检测所有人脸，按面积从大到小排序
    
    Args:
        image_bytes: 图片字节数据
        face_model_path: 人脸检测模型路径（可选，默认使用yolov11l-face.pt）
        conf_threshold: 置信度阈值
        
    Returns:
        包含所有人脸区域的响应
    """
    try:
        # 从字节数据加载图片
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        original_width, original_height = image.size
        
        # 检测所有人脸
        faces = detect_faces(image, face_model_path=face_model_path, conf_threshold=conf_threshold)
        
        # 构建人脸区域列表
        face_regions = []
        for x1, y1, x2, y2 in faces:
            face_regions.append({
                "x1": int(x1),
                "y1": int(y1),
                "x2": int(x2),
                "y2": int(y2),
                "width": int(x2 - x1),
                "height": int(y2 - y1)
            })
        
        return DetectFacesResponse(
            code=200,
            data={
                "faces": face_regions,
                "count": len(face_regions),
                "size": {
                    "width": original_width,
                    "height": original_height
                }
            },
            message="检测成功"
        )
        
    except Exception as e:
        return DetectFacesResponse(
            code=500,
            message=f"检测失败: {str(e)}"
        )


def predict_all_faces(
    image_name: str,
    content_type: str,
    image_bytes: bytes,
    model_path: Optional[str] = None,
    face_model_path: Optional[str] = None,
    conf_threshold: float = 0.5
) -> PredictAllResponse:
    """
    从图片字节数据预测所有人脸的外观得分
    
    Args:
        image_bytes: 图片字节数据
        model_path: 模型文件路径（可选，默认使用final_best_model_full.pth）
        face_model_path: 人脸检测模型路径（可选，默认使用yolov11l-face.pt）
        conf_threshold: 人脸检测置信度阈值
        
    Returns:
        包含所有人脸区域及评分的响应
    """
    try:
        # 保存原图
        now = datetime.now()
        # 格式化时间部分
        year = now.strftime("%Y")
        month = now.strftime("%m")
        day = now.strftime("%d")
        time_str = now.strftime("%H%M%S")
        snowflake_id = next(generator)
        name = Path(image_name).stem
        ext = Path(image_name).suffix
        path = f"synerunify/appearance/{year}/{month}/{day}/{time_str}_{snowflake_id}_{name}/source{ext}"
        upload_to_minio(image_bytes, path, content_type)

        # 加载模型
        model = get_cached_model(model_path)
        
        # 从字节数据加载图片
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        original_width, original_height = image.size
        
        # 检测所有人脸
        faces = detect_faces(image, face_model_path=face_model_path, conf_threshold=conf_threshold)
        
        if not faces:
            return PredictAllResponse(
                code=500,
                data={
                    "faces": [],
                    "count": 0,
                    "size": {
                        "width": original_width,
                        "height": original_height
                    }
                },
                message="未检测到人脸"
            )
        
        # 对每个人脸进行预测
        results = []
        model.eval()
        
        # 基础路径（不包含文件名）
        base_path = f"synerunify/appearance/{year}/{month}/{day}/{time_str}_{snowflake_id}_{name}"
        
        for idx, (x1, y1, x2, y2) in enumerate(faces, start=1):
            try:
                # 裁剪人脸区域
                bbox = (x1, y1, x2, y2)
                face_image = crop_face_region(image, bbox)
                
                # 预处理图片
                image_tensor = data_transform(face_image).unsqueeze(0).to(device)
                
                # 预测
                with torch.no_grad():
                    output = model(image_tensor)
                    score = output.cpu().item()
                
                # 计算最终得分
                final_score = float(score) * 20
                
                # 构建人脸区域信息
                face_region = {
                    "x1": int(x1),
                    "y1": int(y1),
                    "x2": int(x2),
                    "y2": int(y2),
                    "width": int(x2 - x1),
                    "height": int(y2 - y1)
                }
                
                # 上传区域图片
                # 文件名格式：序号_得分.png
                face_filename = f"{idx}_{final_score:.1f}.png"
                face_path = f"{base_path}/{face_filename}"
                
                # 将人脸区域图片转换为字节
                face_image_bytes = io.BytesIO()
                face_image.save(face_image_bytes, format='PNG')
                face_image_bytes.seek(0)
                face_image_data = face_image_bytes.read()
                
                # 上传到MinIO
                upload_to_minio(face_image_data, face_path, "image/png")
                
                results.append({
                    "region": face_region,
                    "score": final_score,
                    "image_path": face_path
                })
            except Exception as e:
                print(f"预测单个人脸失败: {e}")
                continue

        return PredictAllResponse(
            code=200,
            data={
                "faces": results,
                "count": len(results),
                "size": {
                    "width": original_width,
                    "height": original_height
                }
            },
            message="预测成功"
        )
        
    except Exception as e:
        return PredictAllResponse(
            code=500,
            message=f"预测失败: {str(e)}"
        )

