# HTTP Encryption WASM Plugin
A Rust-based Istio WASM plugin for encrypting/decrypting HTTP data using AES-GCM, with keys fetched from Redis.

## Prerequisites
- Rust and `wasm-pack`
- Istio with Envoy
- Redis with HTTP interface

## Build
```bash
wasm-pack build --target wasm32-wasi --release 
```
## Deploy 
```bash
kubectl apply -f wasm_plugin.yaml
```