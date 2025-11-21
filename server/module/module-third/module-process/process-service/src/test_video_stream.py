"""
视频流检测测试脚本
用于测试YOLO11视频流检测功能
"""
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.utils.video_stream import test_stream
from src.utils.yolo import YOLODetector


def main():
    """主函数"""
    print("=" * 60)
    print("YOLO11视频流检测测试")
    print("=" * 60)
    print()
    print("支持的视频流格式:")
    print("  1. 本地摄像头: 0 (第一个摄像头)")
    print("  2. RTSP流: rtsp://username:password@ip:port/stream")
    print("  3. RTMP流: rtmp://ip:port/live/stream")
    print("  4. HTTP流: http://ip:port/video.mjpg")
    print("  5. 本地视频文件: /path/to/video.mp4")
    print()
    
    # 获取用户输入
    stream_url = input("请输入视频流URL (默认: 0 本地摄像头): ").strip()
    if not stream_url:
        stream_url = "0"
    
    conf_threshold = input("请输入置信度阈值 (0.0-1.0, 默认: 0.25): ").strip()
    if not conf_threshold:
        conf_threshold = 0.25
    else:
        try:
            conf_threshold = float(conf_threshold)
        except ValueError:
            print("无效的置信度阈值，使用默认值 0.25")
            conf_threshold = 0.25
    
    # 询问是否保存视频
    save_video = input("是否保存检测结果为MP4视频? (y/n, 默认: n): ").strip().lower()
    output_path = None
    fps = None
    
    if save_video == 'y' or save_video == 'yes':
        output_path = input("请输入输出文件路径 (默认: output_detection.mp4): ").strip()
        if not output_path:
            from datetime import datetime
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = f"output_detection_{timestamp}.mp4"
        
        fps_input = input("请输入输出视频帧率 (留空使用输入流帧率): ").strip()
        if fps_input:
            try:
                fps = float(fps_input)
            except ValueError:
                print("无效的帧率，将使用输入流帧率")
                fps = None
    
    print()
    print(f"开始处理视频流: {stream_url}")
    print(f"置信度阈值: {conf_threshold}")
    if output_path:
        print(f"输出视频: {output_path}")
    print("按 'q' 键退出")
    print()
    
    try:
        test_stream(stream_url, conf_threshold, output_path=output_path, fps=fps)
    except KeyboardInterrupt:
        print("\n\n用户中断")
    except Exception as e:
        print(f"\n错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # rtmp://uam-video.digital-aviation.sh.cn/live/test
    main()

