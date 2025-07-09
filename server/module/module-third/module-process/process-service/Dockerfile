# 假设使用的是 Python 官方镜像
FROM python:3.12 AS build

# 安装 grpcio-tools
RUN pip install grpcio-tools

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 运行 protoc 命令
RUN python3 -m grpc_tools.protoc -Iproto --python_out=src --grpc_python_out=src proto/image_service.proto

# 使用 Ubuntu 24.04 作为基础镜像
FROM ubuntu:24.04

# 设置非交互式安装，避免提示
ENV DEBIAN_FRONTEND=noninteractive

# 安装依赖
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
    python3 \
    python3-pip \
    supervisor \
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

WORKDIR /app

# 克隆 Tesseract 源码并编译安装
RUN cd /app \
    && git clone https://github.com/QiusHosens/tesseract.git \
    && cd tesseract \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
    && ldconfig \
    && cd .. \
    && rm -rf tesseract

RUN wget https://github.com/tesseract-ocr/tessdata/raw/main/eng.traineddata -P /usr/local/share/tessdata/ \
    && wget https://github.com/tesseract-ocr/tessdata/raw/main/chi_sim.traineddata -P /usr/local/share/tessdata/

# 设置环境变量
ENV TESSDATA_PREFIX=/usr/local/share/tessdata

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装虚拟环境/安装 Python 依赖
RUN apt update && apt install python3-venv -y \
    && python3 -m venv /app/venv \
    && . /app/venv/bin/activate \
    && /app/venv/bin/pip install -r requirements.txt

# 生成 gRPC 代码
COPY --from=builder /app/src/image_service_* /app/src/

# 配置 supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080 50051

# 默认运行 supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]