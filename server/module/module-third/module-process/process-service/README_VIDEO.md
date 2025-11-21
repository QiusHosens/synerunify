# 视频流YOLO检测功能使用说明

## 功能概述

本功能实现了视频流拉取和实时YOLO目标检测，支持多种视频流协议（RTSP、RTMP、HTTP等），并提供Web界面实时展示检测结果。

## 安装依赖

首先安装必要的依赖包：

```bash
pip install -r requirements.txt
```

主要新增依赖：
- `opencv-python`: 视频流处理
- `ultralytics`: YOLO目标检测
- `torch`: PyTorch深度学习框架

## 使用方法

### 1. 启动服务

```bash
python app/main.py
```

或使用uvicorn：

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

### 2. 访问Web界面

在浏览器中打开：
```
http://localhost:8080/static/video_stream.html
```

### 3. API端点

#### 实时视频流检测（MJPEG流）

```
GET /video/stream?stream_url=<URL>&conf_threshold=0.25&model_size=n
```

参数：
- `stream_url`: 视频流URL（必需）
  - RTSP: `rtsp://username:password@ip:port/stream`
  - RTMP: `rtmp://ip:port/live/stream`
  - HTTP: `http://ip:port/video.mjpg`
  - 本地摄像头: `0` (Linux/Mac) 或 `0` (Windows)
- `conf_threshold`: 置信度阈值（0.0-1.0，默认0.25）
- `model_size`: 模型大小（n/s/m/l/x，默认n）

示例：
```bash
# 使用本地摄像头
curl "http://localhost:8080/video/stream?stream_url=0&conf_threshold=0.25&model_size=n"

# 使用RTSP流
curl "http://localhost:8080/video/stream?stream_url=rtsp://user:pass@192.168.1.100:554/stream"
```

在浏览器中访问该URL可以直接看到视频流。

#### 单帧检测（JSON结果）

```
POST /video/detect_frame
Content-Type: application/json

{
    "stream_url": "rtsp://...",
    "conf_threshold": 0.25,
    "model_size": "n"
}
```

返回：
```json
{
    "detections": [
        {
            "class_id": 0,
            "class_name": "person",
            "confidence": 0.95,
            "bbox": [100, 200, 300, 400]
        }
    ],
    "detection_count": 1,
    "annotated_image": "data:image/jpeg;base64,..."
}
```

#### 获取支持的类别列表

```
GET /video/classes
```

返回所有YOLO模型支持的检测类别。

## 支持的视频流格式

1. **RTSP流**: `rtsp://username:password@ip:port/path`
2. **RTMP流**: `rtmp://ip:port/live/stream`
3. **HTTP流**: `http://ip:port/video.mjpg`
4. **本地摄像头**: `0` (第一个摄像头), `1` (第二个摄像头), 等等
5. **本地视频文件**: `/path/to/video.mp4`

## YOLO模型说明

系统使用YOLOv8模型，支持以下尺寸：

- **n (nano)**: 最快，适合实时检测，精度较低
- **s (small)**: 平衡速度和精度
- **m (medium)**: 较好的精度
- **l (large)**: 高精度
- **x (xlarge)**: 最高精度，速度较慢

首次运行时会自动下载预训练模型（约6-200MB，取决于模型大小）。

## 使用示例

### Python客户端示例

```python
import cv2
import requests

# 方式1: 直接访问MJPEG流
stream_url = "http://localhost:8080/video/stream?stream_url=0&conf_threshold=0.25"
cap = cv2.VideoCapture(stream_url)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    cv2.imshow('Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# 方式2: 使用API获取单帧检测结果
response = requests.post(
    "http://localhost:8080/video/detect_frame",
    json={
        "stream_url": "0",
        "conf_threshold": 0.25,
        "model_size": "n"
    }
)
result = response.json()
print(f"检测到 {result['detection_count']} 个目标")
```

### JavaScript/HTML示例

```html
<img src="http://localhost:8080/video/stream?stream_url=0&conf_threshold=0.25" />
```

## 性能优化建议

1. **模型选择**: 对于实时检测，推荐使用 `n` 或 `s` 尺寸模型
2. **置信度阈值**: 根据实际需求调整，较低的值会检测更多目标但可能有误检
3. **视频流分辨率**: 降低输入分辨率可以提高处理速度
4. **硬件加速**: 如果有GPU，PyTorch会自动使用GPU加速

## 故障排除

### 无法打开视频流

- 检查视频流URL是否正确
- 确认网络连接正常（对于网络流）
- 检查摄像头权限（对于本地摄像头）
- 查看服务端日志获取详细错误信息

### 检测速度慢

- 使用更小的模型（n或s）
- 降低输入视频分辨率
- 检查是否有GPU可用
- 调整置信度阈值

### 内存占用高

- 使用较小的模型
- 限制并发连接数
- 定期重启服务

## 注意事项

1. 首次运行需要下载YOLO模型，可能需要一些时间
2. 视频流处理会消耗较多CPU/GPU资源
3. 建议在生产环境中限制并发连接数
4. RTSP流可能需要安装额外的编解码器支持

