# build server
FROM rust AS build-server

RUN apt update && apt install -y musl-tools musl-dev curl unzip
RUN update-ca-certificates

WORKDIR /app

# install protoc
ARG PROTOC_VERSION=31.1
RUN curl -Lo protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOC_VERSION}/protoc-${PROTOC_VERSION}-linux-x86_64.zip" && \
    unzip protoc.zip -d /usr/local && \
    rm protoc.zip && \
    chmod +x /usr/local/bin/protoc

COPY ./server ./server

RUN cd server && \
    cargo build --release

# build captcha
FROM golang:1.24 AS build-captcha

WORKDIR /app

COPY ./server/module/module-third/module-captcha/captcha-service ./captcha-service

ARG TARGETOS
ARG TARGETARCH

RUN cd captcha-service && \
    go env -w GOPROXY=https://goproxy.cn && \
    go mod download && \
    CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -ldflags="-w -s" -v -a -trimpath -o captcha-service ./cmd/captcha

# build admin
FROM node AS build-admin
WORKDIR /app

COPY ./admin ./admin

RUN cd admin && \
#    npm install yarn -g --registry https://registry.npmmirror.com && \
    yarn install --registry https://registry.npmmirror.com && \
    yarn build

# build final
FROM nginx
WORKDIR /app

# set env
ENV SYSTEM_SERVER_PORT=9000
ENV LOGGER_SERVER_PORT=9010
ENV GRPC_CAPTCHA_SERVICE_URL=http://localhost:50051

COPY --from=build-server /app/server/target/release/system-server ./system-server
COPY --from=build-server /app/server/target/release/logger-server ./logger-server
COPY --from=build-server /app/server/regexes.yaml ./regexes.yaml

COPY --from=build-captcha /app/captcha-service/captcha-service .
COPY --from=build-captcha /app/captcha-service/config.json .
COPY --from=build-captcha /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=build-admin /app/admin/dist /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf
COPY entrypoint.sh /app/entrypoint.sh

RUN ["chmod", "+x", "./entrypoint.sh"]

EXPOSE 80 9000 9010 8080 50051

ENTRYPOINT ["/app/entrypoint.sh"]