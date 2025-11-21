# Process Service

- A Python project providing HTTP and gRPC services for image processing using Tesseract OCR and PaddleOCR. The HTTP service is built with FastAPI, and both services run simultaneously in a Docker container using supervisord.

## Prerequisites

- Docker
- Python 3.8+ (for running clients locally)
- Tesseract OCR (included in Docker image)

## Project Structure

```
process-service/
├── app/                    # FastAPI 应用主目录
│   ├── main.py            # FastAPI 入口
│   ├── routers/           # API 路由模块
│   │   ├── __init__.py
│   │   └── process.py     # 处理相关的路由
│   ├── models/            # Pydantic 模型（请求/响应校验）
│   │   ├── __init__.py
│   │   └── process.py     # 处理相关的模型
│   ├── core/              # 核心配置模块
│   │   ├── __init__.py
│   │   └── config.py      # 配置管理
│   └── dependencies.py    # 公共依赖
├── src/                   # 原有业务逻辑代码
│   ├── utils/            # 工具模块
│   │   ├── minio_util.py
│   │   └── ocr_detection_util.py
│   └── ...
├── tests/                 # 测试目录
│   ├── __init__.py
│   └── test_process.py
├── Dockerfile
├── requirements.txt
├── .env                   # 环境变量
├── .gitignore
└── README.md
```

## Setup

1. **配置环境变量**  

   创建 `.env` 文件，配置以下变量：
   - `FLASK_PORT`: HTTP 服务端口（默认：8080）
   - `FLASK_DEBUG`: 调试模式（默认：false）
   - `MINIO_ENDPOINT`: MinIO 服务地址
   - `MINIO_ACCESS_KEY`: MinIO 访问密钥
   - `MINIO_SECRET_KEY`: MinIO 密钥
   - `MINIO_SECURE`: 是否使用 HTTPS（默认：false）
   - `GRPC_PORT`: gRPC 服务端口（默认：50051）

2. **安装依赖**:

   ```bash
   pip install -r requirements.txt
   ```

3. **运行 FastAPI 服务**:

   ```bash
   # 开发模式（自动重载）
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
   
   # 或直接运行
   python app/main.py
   ```

4. **Build Docker Image**:

   ```bash
   docker build -t process-service .
   ```

5. **Run Both HTTP and gRPC Servers**:

   ```bash
   docker run -p 8080:8080 -p 50051:50051 process-service
   ```

    - HTTP server (FastAPI) runs on port 8080.
    - gRPC server runs on port 50051.

## Usage

### FastAPI API 文档

启动服务后，访问以下地址查看自动生成的 API 文档：

- Swagger UI: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

### API 端点

#### 1. 处理上传的图片 (`POST /process/process_image`)

上传图片文件进行 OCR 识别：

```bash
curl -X POST "http://localhost:8080/process/process_image" \
  -F "image=@your_image.png" \
  -F "config=--oem 3 --psm 6"
```

#### 2. 通过路径处理图片 (`POST /process/process_image_path`)

通过 MinIO 路径处理图片：

```bash
curl -X POST "http://localhost:8080/process/process_image_path" \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "bucket/path/to/image.png",
    "config": "--oem 3 --psm 6"
  }'
```

#### 3. 解析文档 (`POST /process/parse_document`)

解析文档（发票）并进行 OCR 识别：

```bash
curl -X POST "http://localhost:8080/process/parse_document" \
  -H "Content-Type: application/json" \
  -d '{
    "source_file": "bucket/path/to/document.pdf",
    "output_dir": "bucket/output/path"
  }'
```

### HTTP Client

使用原有的 HTTP 客户端：

```bash
python src/client/http_client.py
```

### gRPC Client

使用 gRPC 客户端上传图片：

```bash
python src/client/grpc_client.py
```

### 运行测试

```bash
pytest tests/
```

## Notes

1. The service supports English (`eng`) and Simplified Chinese (`chi_sim`) languages.
2. Replace `sample_image.png` with your image file path.
3. HTTP is suitable for simple requests; gRPC is better for large files due to streaming.
4. Both services are managed by supervisord to run concurrently in the container.

- For production, configure SSL/TLS for secure communication.