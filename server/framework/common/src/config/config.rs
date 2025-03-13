use serde::Deserialize;
use std::env;
use std::sync::{Arc, OnceLock};
use lazy_static::lazy_static;
use tokio::sync::OnceCell;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub server_port: u16, // 服务端口
    pub database_url: String, // 数据库地址
    pub api_prefix: String, // api前缀
    pub log_level: String, // 日志级别
    pub redis_url: String, // redis地址
    pub mongo_url: String, // mongo地址
}

static CONFIG_INSTANCE: OnceLock<Config> = OnceLock::new();

impl Config {
    pub fn load() -> Config {
        CONFIG_INSTANCE.get_or_init(|| {
            let server_port = env::var("SERVER_PORT")
                .unwrap_or_else(|_| "3000".to_string())
                .parse::<u16>().unwrap_or_else(|_| 3000);
            let database_url = env::var("DATABASE_URL")
                .unwrap_or_else(|_| "mysql://synerunify:synerunify@127.0.0.1:3306/synerunify".to_string());
            let api_prefix = env::var("API_PREFIX")
                .unwrap_or_else(|_| "".to_string());
            let log_level = env::var("LOG_LEVEL")
                .unwrap_or_else(|_| "info".to_string());
            let redis_url = env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://synerunify:synerunify@127.0.0.1:6379/".to_string());
            let mongo_url = env::var("MONGO_URL")
                .unwrap_or_else(|_| "mongodb://synerunify:synerunify@127.0.0.1:27017".to_string());

            Config {
                server_port,
                database_url,
                api_prefix,
                log_level,
                redis_url,
                mongo_url
            }
        }).clone()
    }
}