# 使用官方 Rust 镜像作为基础镜像
FROM rust:1.87 AS builder

# 安装 wasm-pack
RUN cargo install wasm-pack

# 设置工作目录
WORKDIR /usr/src/http-encryption

# 复制项目文件
COPY Cargo.toml .
COPY src/ src/

# 构建 WASM 模块
RUN wasm-pack build --target wasm32-wasi --release

# 最终镜像，用于输出 WASM 文件
FROM scratch AS output
COPY --from=builder /usr/src/http-encryption/pkg/http_encryption.wasm /http_encryption.wasm