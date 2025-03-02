use serde::Deserialize;
use dotenvy::{from_filename_override, dotenv};
use std::env;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub server_port: u16,
    pub database_url: String,
    pub api_prefix: String,
}

impl Config {
    pub fn load() -> Result<Self, anyhow::Error> {
        let server_port = env::var("SERVER_PORT")
            .unwrap_or_else(|_| "9000".to_string())
            .parse::<u16>().unwrap_or_else(|_| 9000);
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "mysql://synerunify:synerunify@192.168.1.18:30010/synerunify".to_string());
        let api_prefix = env::var("API_PREFIX")
            .unwrap_or_else(|_| "".to_string());

        Ok(Config {
            server_port,
            database_url,
            api_prefix,
        })
    }
}