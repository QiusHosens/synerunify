use anyhow::{anyhow, Result};
use captcha_grpc_rust::CaptchaClient;
use common::config::config::Config;

const API_KEY: &str = "synerunify-captcha-secret-key-12345678";

pub async fn check_status(captcha_key: String) -> Result<bool> {
    let mut client = get_client().await?;
    let result = client
        .check_status(captcha_key.to_string(), API_KEY)
        .await?;
    Ok(result)
}

async fn get_client() -> Result<CaptchaClient> {
  let config = Config::load();
  Ok(CaptchaClient::new(config.grpc_captcha_service_url.as_str()).await?)
}