# Process Service

- A Python project providing HTTP and gRPC services for image processing using Tesseract OCR. Both services run simultaneously in a Docker container using supervisord.

## Prerequisites

- Docker
- Python 3.8+ (for running clients locally)
- Tesseract OCR (included in Docker image)

## Project Structure

```
process-service/
├── Dockerfile
├── requirements.txt
├── proto/
│   └── image_service.proto
├── src/
│   ├── http_server.py
│   ├── grpc_server.py
│   ├── client/
│   │   ├── http_client.py
│   │   └── grpc_client.py
│   └── supervisord.conf
└── README.md
```

## Setup

1. **Build Docker Image**:

   ```bash
   docker build -t process-service .
   ```

2. **Run Both HTTP and gRPC Servers**:

   ```bash
   docker run -p 8080:8080 -p 50051:50051 process-service
   ```

    - HTTP server runs on port 8080.
    - gRPC server runs on port 50051.

3. **Install Client Dependencies** (if running clients locally):

   ```bash
   pip install -r requirements.txt
   ```

## Usage

### HTTP Client

Upload an image for text recognition:

```bash
python src/client/http_client.py
```

### gRPC Client

Upload an image using streaming:

```bash
python src/client/grpc_client.py
```

## Notes

1. The service supports English (`eng`) and Simplified Chinese (`chi_sim`) languages.
2. Replace `sample_image.png` with your image file path.
3. HTTP is suitable for simple requests; gRPC is better for large files due to streaming.
4. Both services are managed by supervisord to run concurrently in the container.

- For production, configure SSL/TLS for secure communication.