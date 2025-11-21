"""
视频流处理相关的 API 路由
支持实时视频流拉取和YOLO11目标检测
"""
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
import cv2
from pydantic import BaseModel

from src.utils.video_stream import VideoStreamProcessor
from src.utils.yolo import get_detector

router = APIRouter(prefix="/video", tags=["video"])


class StreamRequest(BaseModel):
    """视频流请求模型"""
    stream_url: str
    conf_threshold: Optional[float] = 0.25
    model_path: Optional[str] = None
    model_size: Optional[str] = "n"


# 全局存储活跃的视频流处理器
_active_processors: dict = {}


@router.get("/stream")
async def stream_video(
    stream_url: str = Query(..., description="视频流URL（支持RTSP、RTMP、HTTP等）"),
    conf_threshold: float = Query(0.25, description="检测置信度阈值", ge=0.0, le=1.0),
    model_size: str = Query("n", description="YOLO11模型大小: n/s/m/l/x")
):
    """
    实时视频流检测端点
    返回MJPEG格式的视频流，包含YOLO11检测结果
    
    Args:
        stream_url: 视频流URL
        conf_threshold: 检测置信度阈值
        model_size: YOLO11模型大小
        
    Returns:
        MJPEG格式的视频流
    """
    try:
        # 获取检测器
        detector = get_detector(model_size=model_size)
        
        # 创建视频流处理器
        processor = VideoStreamProcessor(
            stream_url=stream_url,
            detector=detector,
            conf_threshold=conf_threshold
        )
        
        # 启动处理
        processor.start()
        
        def generate():
            """生成视频帧"""
            try:
                for frame_bytes in processor.generate_frames():
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            finally:
                processor.stop()
        
        return StreamingResponse(
            generate(),
            media_type="multipart/x-mixed-replace; boundary=frame"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理视频流时出错: {str(e)}")


@router.post("/detect_frame")
async def detect_frame(
    request: StreamRequest
):
    """
    对视频流的单帧进行检测（返回JSON结果）
    
    Args:
        request: 包含视频流URL和检测参数的请求体
        
    Returns:
        包含检测结果的JSON响应
    """
    try:
        # 获取检测器
        detector = get_detector(
            model_path=request.model_path,
            model_size=request.model_size or "n"
        )
        
        # 打开视频流并读取一帧
        cap = cv2.VideoCapture(request.stream_url)
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail=f"无法打开视频流: {request.stream_url}")
        
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            raise HTTPException(status_code=400, detail="无法读取视频帧")
        
        # 执行检测
        annotated_frame, detections = detector.detect_frame(frame, request.conf_threshold)
        
        # 将标注后的图像编码为base64
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        import base64
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "detections": detections,
            "detection_count": len(detections),
            "annotated_image": f"data:image/jpeg;base64,{image_base64}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理时出错: {str(e)}")


@router.get("/classes")
async def get_classes():
    """
    获取YOLO11模型支持的类别列表
    
    Returns:
        类别名称字典
    """
    try:
        detector = get_detector()
        class_names = detector.get_class_names()
        return {
            "classes": {str(k): v for k, v in class_names.items()},
            "total": len(class_names)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取类别列表时出错: {str(e)}")


@router.get("/health")
async def video_health():
    """视频服务健康检查"""
    return {
        "status": "healthy",
        "service": "video_stream_detection"
    }

