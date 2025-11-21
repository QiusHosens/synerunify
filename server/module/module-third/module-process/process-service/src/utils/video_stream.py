"""
视频流处理模块
支持RTSP、RTMP、HTTP等视频流协议的拉取和实时YOLO11检测处理
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


def test_stream(stream_url: str, conf_threshold: float = 0.25, 
                output_path: Optional[str] = None, fps: Optional[float] = None):
    """
    测试视频流检测（本地显示并可选保存为MP4）
    
    Args:
        stream_url: 视频流URL
        conf_threshold: 置信度阈值
        output_path: 输出MP4视频文件路径，如果为None则不保存
        fps: 输出视频的帧率，如果为None则使用输入流的帧率
    """
    import os
    
    detector = get_detector()
    
    print(f"开始处理视频流: {stream_url}")
    if output_path:
        print(f"检测结果将保存到: {output_path}")
    print("按 'q' 键退出")
    
    cap = cv2.VideoCapture(stream_url)
    
    if not cap.isOpened():
        print(f"错误: 无法打开视频流 {stream_url}")
        return
    
    # 获取视频属性
    input_fps = cap.get(cv2.CAP_PROP_FPS)
    if input_fps <= 0:
        input_fps = 30.0  # 默认帧率
    output_fps = fps if fps is not None else input_fps
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"视频尺寸: {width}x{height}, 帧率: {output_fps:.2f} FPS")
    
    # 初始化视频写入器
    video_writer = None
    if output_path:
        # 确保输出目录存在
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        # 尝试使用不同的编码器（按优先级）
        # 优先使用H.264编码器，如果不支持则尝试其他编码器
        codecs = [
            ('avc1', 'H.264 (avc1)'),
            ('mp4v', 'MPEG-4 (mp4v)'),
            ('XVID', 'XVID'),
            ('MJPG', 'Motion-JPEG')
        ]
        
        video_writer = None
        for fourcc_code, codec_name in codecs:
            fourcc = cv2.VideoWriter_fourcc(*fourcc_code)
            video_writer = cv2.VideoWriter(output_path, fourcc, output_fps, (width, height))
            if video_writer.isOpened():
                print(f"使用编码器: {codec_name}")
                break
            else:
                video_writer = None
        
        if not video_writer:
            print(f"警告: 无法创建视频文件 {output_path}，将只显示不保存")
            print("提示: 可能需要安装额外的编解码器支持")
    
    frame_count = 0
    detection_count_total = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("无法读取视频帧")
                break
            
            # 执行检测
            annotated_frame, detections = detector.detect_frame(frame, conf_threshold)
            
            # 统计检测结果
            if detections:
                detection_count_total += len(detections)
                print(f"帧 {frame_count}: 检测到 {len(detections)} 个目标")
            
            # 保存到视频文件
            if video_writer:
                video_writer.write(annotated_frame)
            
            # 显示检测结果
            # 在图像上添加帧计数和统计信息
            info_text = f"Frame: {frame_count} | Detections: {len(detections)} | Total: {detection_count_total}"
            cv2.putText(annotated_frame, info_text, (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            cv2.imshow('YOLO Detection', annotated_frame)
            
            frame_count += 1
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    finally:
        cap.release()
        if video_writer:
            video_writer.release()
            print(f"\n视频已保存到: {output_path}")
            print(f"总帧数: {frame_count}, 总检测数: {detection_count_total}")
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

