use serde::Deserialize;
use dotenvy::from_filename_override;
use std::env;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub app_env: String,
    pub server_port: u16,
    pub database_url: String,
}

impl Config {
    pub fn load() -> Result<Self, anyhow::Error> {
        // 获取 APP_ENV，默认值为 "dev"
        let env = env::var("APP_ENV").unwrap_or_else(|_| "dev".to_string());

        // 动态构造 .env 文件名，例如 .env.dev、.env.test
        let env_file = format!(".env.{}", env);

        // 加载对应的 .env 文件，允许环境变量覆盖
        from_filename_override(&env_file).ok(); // 如果文件不存在，依赖环境变量

        let app_env = env::var("APP_ENV")
            .unwrap_or_else(|_| "dev".to_string());
        let server_port = env::var("SERVER_PORT")
            .unwrap_or_else(|_| "3000".to_string())
            .parse::<u16>()?;
        let database_url = env::var("DATABASE_URL")
            .map_err(|_| anyhow::anyhow!("DATABASE_URL must be set"))?;

        Ok(Config {
            app_env,
            server_port,
            database_url,
        })
    }
}