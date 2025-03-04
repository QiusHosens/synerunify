use serde::Deserialize;
use std::env;
use std::sync::Arc;
use lazy_static::lazy_static;
use tokio::sync::OnceCell;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub server_port: u16,
    pub database_url: String,
    pub api_prefix: String,
    pub log_level: String,
}

lazy_static! {
    static ref CONFIG_INSTANCE: OnceCell<Config> = OnceCell::new();
}

impl Config {
    pub async fn load() -> Config {
        CONFIG_INSTANCE.get_or_init(|| async {
            let server_port = env::var("SERVER_PORT")
                .unwrap_or_else(|_| "9000".to_string())
                .parse::<u16>().unwrap_or_else(|_| 9000);
            let database_url = env::var("DATABASE_URL")
                .unwrap_or_else(|_| "mysql://synerunify:synerunify@192.168.1.18:30010/synerunify".to_string());
            let api_prefix = env::var("API_PREFIX")
                .unwrap_or_else(|_| "".to_string());
            let log_level = env::var("LOG_LEVEL")
                .unwrap_or_else(|_| "info".to_string());

            Config {
                server_port,
                database_url,
                api_prefix,
                log_level,
            }
        }).await.clone()
    }
}