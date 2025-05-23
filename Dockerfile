# build server
FROM rust AS build-server

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install -y musl-tools musl-dev
RUN update-ca-certificates

WORKDIR /app

COPY ./server .

RUN cd server \
    cargo build --release

# build admin
From node AS build-admin
WORKDIR /app

COPY ./admin .

RUN cd admin \
    npm install yarn -g --registry https://registry.npmmirror.com \
    yarn install --registry https://registry.npmmirror.com \
    yarn build