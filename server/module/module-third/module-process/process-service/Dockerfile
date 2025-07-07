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

# 安装 Python 依赖
RUN pip3 install -r requirements.txt

# 生成 gRPC 代码
RUN python3 -m grpc_tools.protoc -Iproto --python_out=src --grpc_python_out=src proto/image_service.proto

# 配置 supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080 50051

# 默认运行 supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]