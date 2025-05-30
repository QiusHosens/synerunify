# Build phase
FROM golang:1.24 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go env -w GOPROXY=https://goproxy.cn && \
    go mod download

COPY . .

ARG TARGETOS
ARG TARGETARCH
RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -ldflags="-w -s" -v -a -trimpath -o captcha-service ./cmd/captcha

# Run phase (default binary)
FROM scratch AS binary

WORKDIR /app

COPY --from=builder /app/captcha-service .
COPY config.json .
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080 50051

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["/app/captcha-service", "--health-check"] || exit 1

CMD ["/app/captcha-service"]
