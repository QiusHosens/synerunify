use dotenvy::dotenv;
use serde::Deserialize;
use std::env;
use std::sync::{Arc, OnceLock};
use lazy_static::lazy_static;
use tokio::sync::OnceCell;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub system_server_port: u16, // 服务端口
    pub system_server_grpc_port: u16, // 服务端口
    pub logger_server_port: u16, // 服务端口
    pub file_server_port: u16, // 服务端口
    pub erp_server_port: u16, // 服务端口
    pub process_parse_service_port: u16, // 服务端口
    pub database_url: String, // 数据库地址
    pub api_prefix: String, // api前缀
    pub log_level: String, // 日志级别
    pub redis_url: String, // redis地址
    pub mongo_url: String, // mongo地址
    pub minio_url: String, // minio api地址
    pub minio_access_key: String, // minio access key
    pub minio_secret_key: String, // minio secret key
    pub grpc_captcha_service_url: String, // 验证码服务grpc地址
    pub grpc_system_service_url: String, // 系统服务grpc地址
}

static CONFIG_INSTANCE: OnceLock<Config> = OnceLock::new();

impl Config {
    pub fn load() -> Config {
        CONFIG_INSTANCE.get_or_init(|| {
            // 尝试加载 .env 文件，如果不存在则继续
            let _ = dotenv();

            let system_server_port = env::var("SYSTEM_SERVER_PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .unwrap_or(8080);
            let system_server_grpc_port = env::var("SYSTEM_SERVER_GRPC_PORT")
                .unwrap_or_else(|_| "50051".to_string())
                .parse::<u16>()
                .unwrap_or(50051);
            let logger_server_port = env::var("LOGGER_SERVER_PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .unwrap_or(8080);
            let file_server_port = env::var("FILE_SERVER_PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .unwrap_or(8080);
            let erp_server_port = env::var("ERP_SERVER_PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .unwrap_or(8080);
            let process_parse_service_port = env::var("PROCESS_PARSE_SERVICE_PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .unwrap_or(8080);
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

            let minio_url = env::var("MINIO_URL")
                .unwrap_or_else(|_| "http://localhost:9000".to_string());
            let minio_access_key = env::var("MINIO_ACCESS_KEY")
                .unwrap_or_else(|_| "synerunify".to_string());
            let minio_secret_key = env::var("MINIO_SECRET_KEY")
                .unwrap_or_else(|_| "synerunify".to_string());

            let grpc_captcha_service_url = env::var("GRPC_CAPTCHA_SERVICE_URL")
                .unwrap_or_else(|_| "http://localhost:50051".to_string());
            let grpc_system_service_url = env::var("GRPC_SYSTEM_SERVICE_URL")
                .unwrap_or_else(|_| "http://localhost:50051".to_string());

            Config {
                system_server_port,
                system_server_grpc_port,
                logger_server_port,
                file_server_port,
                erp_server_port,
                process_parse_service_port,
                database_url,
                api_prefix,
                log_level,
                redis_url,
                mongo_url,
                minio_url,
                minio_access_key,
                minio_secret_key,
                grpc_captcha_service_url,
                grpc_system_service_url
            }
        }).clone()
    }
}