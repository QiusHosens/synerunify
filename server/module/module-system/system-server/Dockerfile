####################################################################################################
## Builder
####################################################################################################
FROM rust:latest AS builder

RUN rustup target add x86_64-unknown-linux-musl
RUN apt update && apt install git && apt install -y musl-tools musl-dev
RUN update-ca-certificates

# Create appuser
ENV USER=synerunify
ENV UID=10001

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"


WORKDIR /app

RUN cd /app \
    git clone https://oauth2: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@github.com/QiusHosens/synerunify.git

#RUN cargo build --target x86_64-unknown-linux-musl --release
RUN cd /app/synerunify/server \
    cargo build --release --bin system-server

####################################################################################################
## Final image
####################################################################################################
FROM alpine

# Import from builder.
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /app

# Copy our build
#COPY --from=builder /synerunify/target/x86_64-unknown-linux-musl/release/synerunify ./
COPY --from=builder /app/synerunify/server/target/release/system-server ./system-server
COPY --from=builder /app/synerunify/server/.env ./.env
COPY --from=builder /app/synerunify/server/regexes.yaml ./regexes.yaml

# Use an unprivileged user.
USER synerunify:synerunify

EXPOSE 9000

CMD ["/app/system-server"]