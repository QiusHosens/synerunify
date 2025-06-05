# build server
FROM rust AS build-server

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install -y musl-tools musl-dev
RUN update-ca-certificates

WORKDIR /app

COPY ./server ./server

RUN cd server && \
    cargo build --release

# build captcha
FROM golang:1.24 AS build-captcha

WORKDIR /app

COPY ./server/module/module-third/captcha-service ./captcha-service

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