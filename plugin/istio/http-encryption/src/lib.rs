use proxy_wasm::traits::*;
use proxy_wasm::types::*;
use serde_json::Value;
use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce,
};
use std::str;

const REDIS_HOST: &str = "redis-service:6379"; // Redis 服务地址，需在 Istio 配置中指定
const REDIS_KEY: &str = "encryption_key"; // Redis 中存储密钥的键名

struct HttpEncryptionFilter {
    context_id: u32,
    key: Option<[u8; 32]>, // AES-256 密钥（32 字节）
}

impl HttpEncryptionFilter {
    fn fetch_key_from_redis(&self) -> Result<(), Status> {
        // 使用 Envoy 的 http_call 发起对 Redis 的 HTTP 请求
        self.dispatch_http_call(
            "redis-cluster", // 集群名称，需在 Envoy 配置中定义
            vec![
                (":method", "GET"),
                (":path", &format!("/get/{}", REDIS_KEY)),
                (":authority", REDIS_HOST),
            ],
            None,
            vec![],
            5000, // 超时 5 秒
        )?;
        Ok(())
    }
}

impl HttpContext for HttpEncryptionFilter {
    fn on_http_request_headers(&mut self, _nheaders: usize, _eof: bool) -> Action {
        // 在请求开始时获取密钥
        if self.key.is_none() {
            if let Err(_) = self.fetch_key_from_redis() {
                self.send_http_response(500, vec![], Some(b"Failed to fetch key"));
                return Action::Pause;
            }
        }
        Action::Continue
    }

    fn on_http_request_body(&mut self, body_size: usize, _end_of_stream: bool) -> Action {
        if body_size == 0 {
            return Action::Continue;
        }

        if let Some(body) = self.get_http_request_body(0, body_size) {
            if let Ok(json) = str::from_utf8(&body) {
                if let Ok(mut value) = serde_json::from_str::<Value>(json) {
                    if let Some(data) = value["data"].as_str() {
                        if let Some(key) = &self.key {
                            // 解密数据
                            let cipher = Aes256Gcm::new_from_slice(key).unwrap();
                            let nonce = Nonce::from_slice(b"unique_nonce_12"); // 需确保唯一，生产环境从配置获取
                            if let Ok(decrypted) = cipher.decrypt(nonce, data.as_bytes()) {
                                if let Ok(decrypted_str) = str::from_utf8(&decrypted) {
                                    value["data"] = Value::String(decrypted_str.to_string());
                                    let new_body = serde_json::to_string(&value).unwrap();
                                    self.set_http_request_body(0, body_size, new_body.as_bytes());
                                }
                            }
                        }
                    }
                }
            }
        }
        Action::Continue
    }

    fn on_http_response_body(&mut self, body_size: usize, _end_of_stream: bool) -> Action {
        if body_size == 0 {
            return Action::Continue;
        }

        if let Some(body) = self.get_http_response_body(0, body_size) {
            if let Ok(json) = str::from_utf8(&body) {
                if let Ok(mut value) = serde_json::from_str::<Value>(json) {
                    if let Some(data) = value["data"].as_str() {
                        if let Some(key) = &self.key {
                            // 加密数据
                            let cipher = Aes256Gcm::new_from_slice(key).unwrap();
                            let nonce = Nonce::from_slice(b"unique_nonce_12"); // 生产环境需动态生成
                            if let Ok(encrypted) = cipher.encrypt(nonce, data.as_bytes()) {
                                value["data"] = Value::String(base64::encode(&encrypted));
                                let new_body = serde_json::to_string(&value).unwrap();
                                self.set_http_response_body(0, body_size, new_body.as_bytes());
                            }
                        }
                    }
                }
            }
        }
        Action::Continue
    }

    fn on_http_call_response(&mut self, _token_id: u32, _num_headers: usize, body_size: usize, _num_trailers: usize) {
        if let Some(body) = self.get_http_call_response_body(0, body_size) {
            if let Ok(key_str) = str::from_utf8(&body) {
                if let Ok(key_bytes) = base64::decode(key_str) {
                    if key_bytes.len() == 32 {
                        let mut key = [0u8; 32];
                        key.copy_from_slice(&key_bytes);
                        self.key = Some(key);
                        self.resume_http_request(); // 恢复暂停的请求
                    } else {
                        self.send_http_response(500, vec![], Some(b"Invalid key length"));
                    }
                }
            }
        }
    }
}

impl Context for HttpEncryptionFilter {
    fn on_create(&mut self, context_id: u32) {
        self.context_id = context_id;
    }
}

#[no_mangle]
pub fn _start() {
    proxy_wasm::set_http_context(|context_id, _| -> Box<dyn HttpContext> {
        Box::new(HttpEncryptionFilter {
            context_id,
            key: None,
        })
    });
}