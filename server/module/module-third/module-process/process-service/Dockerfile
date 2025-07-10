# 使用 Python 官方镜像作为基础镜像
FROM python:3.12

# 设置非交互式安装，避免提示
ENV DEBIAN_FRONTEND=noninteractive

# 安装系统依赖（包括 Tesseract 所需的库）
RUN apt-get update && apt-get install -y \
    build-essential \
    autoconf \
    automake \
    libtool \
    pkg-config \
    libpng-dev \
    libjpeg-dev \
    libtiff-dev \
    zlib1g-dev \
    libicu-dev \
    libpango1.0-dev \
    libcairo2-dev \
    wget \
    git \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# 安装 Leptonica（Tesseract 依赖的图像处理库）
RUN wget http://www.leptonica.org/source/leptonica-1.84.1.tar.gz \
    && tar -xzf leptonica-1.84.1.tar.gz \
    && cd leptonica-1.84.1 \
    && ./configure \
    && make \
    && make install \
    && cd .. \
    && rm -rf leptonica-1.84.1.tar.gz leptonica-1.84.1

# 设置工作目录
WORKDIR /app

# 克隆 Tesseract 源码并编译安装
RUN git clone https://github.com/QiusHosens/tesseract.git \
    && cd tesseract \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    && ldconfig \
    && cd .. \
    && rm -rf tesseract

# 下载 Tesseract 训练数据
RUN wget https://github.com/tesseract-ocr/tessdata/raw/main/eng.traineddata -P /usr/local/share/tessdata/ \
    && wget https://github.com/tesseract-ocr/tessdata/raw/main/chi_sim.traineddata -P /usr/local/share/tessdata/

# 设置 Tesseract 环境变量
ENV TESSDATA_PREFIX=/usr/local/share/tessdata

# 复制项目文件
COPY . .

# 安装 grpcio-tools 和项目依赖
RUN pip install grpcio-tools \
    && python3 -m venv /app/venv \
    && . /app/venv/bin/activate \
    && /app/venv/bin/pip install -r requirements.txt

# 运行 protoc 命令生成 gRPC 代码
RUN python3 -m grpc_tools.protoc -Iproto --python_out=src --grpc_python_out=src proto/image_service.proto

# 暴露端口
EXPOSE 8080 50051

# 使用 nohup 运行服务并将日志写入同一文件
CMD /app/venv/bin/python src/server.py > /app/log.txt 2>&1 & \
    /app/venv/bin/python src/another_service.py > /app/log.txt 2>&1 & \
    tail -f /app/log.txt