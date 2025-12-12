"""
外观评分相关的 API 路由
提供图片外观评分预测功能
"""
import logging
from datetime import datetime
from typing import Optional
from snowflake import SnowflakeGenerator

from fastapi import APIRouter, UploadFile, File, HTTPException, Query

# 配置日志
logger = logging.getLogger(__name__)

from app.models.appearance import (
    AppearancePredictResponse,
    DetectFacesResponse,
    PredictAllResponse
)
from app.service.appearance import (
    predict_image_from_bytes,
    detect_faces_from_bytes,
    predict_all_faces
)

router = APIRouter(prefix="/process/appearance", tags=["appearance"])

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
    request_time = datetime.now()
    interface_path = "/process/appearance/predict"
    logger.info(f"[Request Start] Interface: {interface_path}, Time: {request_time.strftime('%Y-%m-%d %H:%M:%S.%f')}, Filename: {image.filename}")
    
    try:
        # 验证文件类型
        if not image.content_type or not image.content_type.startswith('image/'):
            error_msg = "文件必须是图片格式"
            logger.warning(f"[Request Failed] Interface: {interface_path}, Error: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
        # 读取上传的文件
        try:
            file_content = await image.read()
        except Exception as e:
            error_msg = f"读取文件失败: {str(e)}"
            logger.error(f"[Request Failed] Interface: {interface_path}, Error: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
        # 调用服务层函数进行预测
        response = predict_image_from_bytes(
            image_bytes=file_content,
            model_path=model_path
        )
        
        # 记录返回结果
        response_time = datetime.now()
        duration = (response_time - request_time).total_seconds()
        logger.info(
            f"[Request Completed] Interface: {interface_path}, "
            f"Time: {response_time.strftime('%Y-%m-%d %H:%M:%S.%f')}, "
            f"Duration: {duration:.3f} seconds, "
            f"Code: {response.code}, "
            f"Message: {response.message}, "
            f"Score: {response.data.get('score') if response.data else None}"
        )
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"预测失败: {str(e)}"
        logger.error(f"[Request Exception] Interface: {interface_path}, Error: {error_msg}")
        raise


@router.post("/detect_faces", response_model=DetectFacesResponse)
async def detect_faces_api(
    image: UploadFile = File(..., description="上传的图片文件"),
    face_model_path: Optional[str] = Query(None, description="人脸检测模型文件路径（可选，默认使用yolov11l-face.pt）"),
    conf_threshold: float = Query(0.5, description="置信度阈值", ge=0.0, le=1.0)
):
    """
    上传图片检测所有人脸，按面积从大到小排序
    
    Args:
        image: 上传的图片文件
        face_model_path: 人脸检测模型文件路径（可选，默认使用yolov11l-face.pt）
        conf_threshold: 置信度阈值（0.0-1.0）
        
    Returns:
        包含所有人脸区域的响应
    """
    request_time = datetime.now()
    interface_path = "/process/appearance/detect_faces"
    logger.info(f"[Request Start] Interface: {interface_path}, Time: {request_time.strftime('%Y-%m-%d %H:%M:%S.%f')}, Filename: {image.filename}, Confidence Threshold: {conf_threshold}")
    
    try:
        # 验证文件类型
        if not image.content_type or not image.content_type.startswith('image/'):
            error_msg = "文件必须是图片格式"
            logger.warning(f"[Request Failed] Interface: {interface_path}, Error: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
        # 读取上传的文件
        try:
            file_content = await image.read()
        except Exception as e:
            error_msg = f"读取文件失败: {str(e)}"
            logger.error(f"[Request Failed] Interface: {interface_path}, Error: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
        # 调用服务层函数进行检测
        response = detect_faces_from_bytes(
            image_bytes=file_content,
            face_model_path=face_model_path,
            conf_threshold=conf_threshold
        )
        
        # 记录返回结果
        response_time = datetime.now()
        duration = (response_time - request_time).total_seconds()
        face_count = response.data.get('count') if response.data else 0
        logger.info(
            f"[Request Completed] Interface: {interface_path}, "
            f"Time: {response_time.strftime('%Y-%m-%d %H:%M:%S.%f')}, "
            f"Duration: {duration:.3f} seconds, "
            f"Code: {response.code}, "
            f"Message: {response.message}, "
            f"Face Count: {face_count}"
        )
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"检测失败: {str(e)}"
        logger.error(f"[Request Exception] Interface: {interface_path}, Error: {error_msg}")
        raise


@router.post("/predict_all", response_model=PredictAllResponse)
async def predict_all_api(
    image: UploadFile = File(..., description="上传的图片文件"),
    model_path: Optional[str] = Query(None, description="模型文件路径（可选，默认使用final_best_model_full.pth）"),
    face_model_path: Optional[str] = Query(None, description="人脸检测模型文件路径（可选，默认使用yolov11l-face.pt）"),
    conf_threshold: float = Query(0.5, description="置信度阈值", ge=0.0, le=1.0)
):
    """
    上传图片预测所有人脸的外观得分
    
    Args:
        image: 上传的图片文件
        model_path: 模型文件路径（可选，默认使用final_best_model_full.pth）
        face_model_path: 人脸检测模型文件路径（可选，默认使用yolov11l-face.pt）
        conf_threshold: 置信度阈值（0.0-1.0）
        
    Returns:
        包含所有人脸区域及评分的响应
    """
    request_time = datetime.now()
    interface_path = "/process/appearance/predict_all"
    logger.info(f"[Request Start] Interface: {interface_path}, Time: {request_time.strftime('%Y-%m-%d %H:%M:%S.%f')}, Filename: {image.filename}, Confidence Threshold: {conf_threshold}")
    
    try:
        # 验证文件类型
        if not image.content_type or not image.content_type.startswith('image/'):
            error_msg = "文件必须是图片格式"
            logger.warning(f"[Request Failed] Interface: {interface_path}, Error: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
        # 读取上传的文件
        try:
            file_content = await image.read()
        except Exception as e:
            error_msg = f"读取文件失败: {str(e)}"
            logger.error(f"[Request Failed] Interface: {interface_path}, Error: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
        # 调用服务层函数进行预测
        response = predict_all_faces(
            image_name=image.filename,
            content_type=image.content_type,
            image_bytes=file_content,
            model_path=model_path,
            face_model_path=face_model_path,
            conf_threshold=conf_threshold
        )
        
        # 记录返回结果
        response_time = datetime.now()
        duration = (response_time - request_time).total_seconds()
        face_count = response.data.get('count') if response.data else 0
        faces = response.data.get('faces', []) if response.data else []
        scores = [face.get('score') for face in faces if isinstance(face, dict) and 'score' in face]
        
        logger.info(
            f"[Request Completed] Interface: {interface_path}, "
            f"Time: {response_time.strftime('%Y-%m-%d %H:%M:%S.%f')}, "
            f"Duration: {duration:.3f} seconds, "
            f"Code: {response.code}, "
            f"Message: {response.message}, "
            f"Face Count: {face_count}, "
            f"Scores: {scores}"
        )
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"预测失败: {str(e)}"
        logger.error(f"[Request Exception] Interface: {interface_path}, Error: {error_msg}")
        raise

