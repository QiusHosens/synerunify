"""
视频流处理模块
支持RTSP、RTMP、HTTP等视频流协议的拉取和实时处理
"""
import cv2
import numpy as np
from typing import Optional, Generator, Tuple, List, Dict
import threading
import time
from queue import Queue
from src.utils.yolo import YOLODetector, get_detector


class VideoStreamProcessor:
    """视频流处理器"""
    
    def __init__(self, stream_url: str, detector: Optional[YOLODetector] = None, 
                 conf_threshold: float = 0.25, max_queue_size: int = 10):
        """
        初始化视频流处理器
        
        Args:
            stream_url: 视频流URL
            detector: YOLO检测器实例，如果为None则创建默认检测器
            conf_threshold: 检测置信度阈值
            max_queue_size: 帧队列最大大小
        """
        self.stream_url = stream_url
        self.conf_threshold = conf_threshold
        self.detector = detector or get_detector()
        self.max_queue_size = max_queue_size
        
        self.cap: Optional[cv2.VideoCapture] = None
        self.frame_queue: Queue = Queue(maxsize=max_queue_size)
        self.running = False
        self.thread: Optional[threading.Thread] = None
        
    def start(self):
        """启动视频流处理"""
        if self.running:
            return
        
        self.running = True
        self.cap = cv2.VideoCapture(self.stream_url)
        
        if not self.cap.isOpened():
            raise ValueError(f"无法打开视频流: {self.stream_url}")
        
        # 启动处理线程
        self.thread = threading.Thread(target=self._process_stream, daemon=True)
        self.thread.start()
    
    def stop(self):
        """停止视频流处理"""
        self.running = False
        if self.cap:
            self.cap.release()
        if self.thread:
            self.thread.join(timeout=2.0)
    
    def _process_stream(self):
        """处理视频流的内部方法（在单独线程中运行）"""
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                print("无法读取视频帧")
                time.sleep(0.1)
                continue
            
            # 执行YOLO检测
            try:
                annotated_frame, detections = self.detector.detect_frame(frame, self.conf_threshold)
                
                # 将结果放入队列（如果队列满了，丢弃最旧的帧）
                if self.frame_queue.full():
                    try:
                        self.frame_queue.get_nowait()
                    except:
                        pass
                
                self.frame_queue.put((annotated_frame, detections))
            except Exception as e:
                print(f"检测过程中出错: {e}")
                time.sleep(0.1)
    
    def get_frame(self, timeout: float = 1.0) -> Optional[Tuple[np.ndarray, List[Dict]]]:
        """
        获取最新的检测帧
        
        Args:
            timeout: 超时时间（秒）
            
        Returns:
            (标注后的图像帧, 检测结果列表) 或 None
        """
        try:
            return self.frame_queue.get(timeout=timeout)
        except:
            return None
    
    def generate_frames(self) -> Generator[bytes, None, None]:
        """
        生成JPEG格式的帧（用于HTTP流式响应）
        
        Yields:
            JPEG编码的图像字节流
        """
        while self.running:
            result = self.get_frame(timeout=0.5)
            if result is None:
                continue
            
            annotated_frame, _ = result
            
            # 将帧编码为JPEG
            ret, buffer = cv2.imencode('.jpg', annotated_frame, 
                                      [cv2.IMWRITE_JPEG_QUALITY, 85])
            if ret:
                frame_bytes = buffer.tobytes()
                yield frame_bytes
    
    def __enter__(self):
        """上下文管理器入口"""
        self.start()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """上下文管理器出口"""
        self.stop()


def test_stream(stream_url: str, conf_threshold: float = 0.25):
    """
    测试视频流检测（本地显示）
    
    Args:
        stream_url: 视频流URL
        conf_threshold: 置信度阈值
    """
    detector = get_detector()
    
    print(f"开始处理视频流: {stream_url}")
    print("按 'q' 键退出")
    
    cap = cv2.VideoCapture(stream_url)
    
    if not cap.isOpened():
        print(f"错误: 无法打开视频流 {stream_url}")
        return
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("无法读取视频帧")
                break
            
            # 执行检测
            annotated_frame, detections = detector.detect_frame(frame, conf_threshold)
            
            # 显示检测结果
            if detections:
                print(f"检测到 {len(detections)} 个目标")
            
            cv2.imshow('YOLO Detection', annotated_frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    # 测试示例
    # 使用本地摄像头
    # test_stream(0)
    
    # 使用RTSP流
    # test_stream("rtsp://username:password@ip:port/stream")
    
    # 使用HTTP流
    # test_stream("http://example.com/video.mjpg")
    pass

