"""
YOLO11目标检测工具模块
支持实时视频流检测和单帧图像检测
使用Ultralytics YOLO11模型，提供更高的检测精度和速度
"""
import cv2
import numpy as np
from typing import List, Tuple, Optional, Dict, Any
from ultralytics import YOLO
import os


class YOLODetector:
    """YOLO目标检测器"""
    
    def __init__(self, model_path: Optional[str] = None, model_size: str = "n"):
        """
        初始化YOLO检测器
        
        Args:
            model_path: 自定义模型路径，如果为None则使用预训练模型
            model_size: 模型大小，可选值: 'n'(nano), 's'(small), 'm'(medium), 'l'(large), 'x'(xlarge)
        """
        if model_path and os.path.exists(model_path):
            self.model = YOLO(model_path)
            print(f"加载自定义模型: {model_path}")
        else:
            # 使用预训练的YOLO11模型
            model_name = f"yolo11{model_size}.pt"
            self.model = YOLO(model_name)
            print(f"加载预训练模型: {model_name}")
        
        self.class_names = self.model.names
        print(f"模型类别数量: {len(self.class_names)}")
    
    def detect_frame(self, frame: np.ndarray, conf_threshold: float = 0.25) -> Tuple[np.ndarray, List[Dict]]:
        """
        对单帧图像进行目标检测
        
        Args:
            frame: 输入图像帧 (BGR格式)
            conf_threshold: 置信度阈值
            
        Returns:
            (标注后的图像帧, 检测结果列表)
        """
        # 执行检测
        results = self.model(frame, conf=conf_threshold, verbose=False)
        
        # 解析检测结果
        detections = []
        annotated_frame = frame.copy()
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # 获取边界框坐标
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = float(box.conf[0].cpu().numpy())
                class_id = int(box.cls[0].cpu().numpy())
                class_name = self.class_names[class_id]
                
                detections.append({
                    'class_id': class_id,
                    'class_name': class_name,
                    'confidence': confidence,
                    'bbox': [float(x1), float(y1), float(x2), float(y2)]
                })
                
                # 在图像上绘制边界框和标签
                cv2.rectangle(annotated_frame, 
                            (int(x1), int(y1)), 
                            (int(x2), int(y2)), 
                            (0, 255, 0), 2)
                
                # 绘制标签
                label = f"{class_name}: {confidence:.2f}"
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(annotated_frame,
                            (int(x1), int(y1) - label_size[1] - 10),
                            (int(x1) + label_size[0], int(y1)),
                            (0, 255, 0), -1)
                cv2.putText(annotated_frame, label,
                          (int(x1), int(y1) - 5),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                          (0, 0, 0), 2)
        
        return annotated_frame, detections
    
    def detect_stream(self, stream_url: str, conf_threshold: float = 0.25):
        """
        对视频流进行实时检测（生成器）
        
        Args:
            stream_url: 视频流URL（支持RTSP、RTMP、HTTP等）
            conf_threshold: 置信度阈值
            
        Yields:
            (标注后的图像帧, 检测结果列表)
        """
        # 打开视频流
        cap = cv2.VideoCapture(stream_url)
        
        if not cap.isOpened():
            raise ValueError(f"无法打开视频流: {stream_url}")
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    print("无法读取视频帧，可能流已结束")
                    break
                
                # 执行检测
                annotated_frame, detections = self.detect_frame(frame, conf_threshold)
                
                yield annotated_frame, detections
                
        finally:
            cap.release()
    
    def get_class_names(self) -> Dict[int, str]:
        """获取类别名称字典"""
        return self.class_names


# 全局检测器实例（懒加载）
_detector_instance: Optional[YOLODetector] = None


def get_detector(model_path: Optional[str] = None, model_size: str = "n") -> YOLODetector:
    """
    获取全局YOLO检测器实例（单例模式）
    
    Args:
        model_path: 自定义模型路径
        model_size: 模型大小
        
    Returns:
        YOLODetector实例
    """
    global _detector_instance
    if _detector_instance is None:
        _detector_instance = YOLODetector(model_path=model_path, model_size=model_size)
    return _detector_instance

