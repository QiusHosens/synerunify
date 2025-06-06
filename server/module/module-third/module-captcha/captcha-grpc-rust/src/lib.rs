pub mod captcha_client;

pub use captcha_client::{CaptchaClient, gocaptcha::GetDataResponse};

#[cfg(test)]
mod tests {
    use anyhow::Result;
    use super::CaptchaClient;

    #[tokio::test]
    async fn test_check_status() -> Result<()> {
        let mut client = CaptchaClient::new("http://localhost:50051").await?;
        let result = client.check_status("babce273-42a1-11f0-b76e-e89c25dffb5f".to_string(), "123").await?;
        println!("result: {:?}", result);
        Ok(())
    }
}