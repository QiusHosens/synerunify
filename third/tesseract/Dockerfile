# 使用 Ubuntu 24.04 作为基础镜像
FROM ubuntu:24.04

# 设置非交互式安装，避免提示
ENV DEBIAN_FRONTEND=noninteractive

# 更新包列表并安装必要的依赖
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

# 默认命令
CMD ["tesseract", "--version"]