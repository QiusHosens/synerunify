use anyhow::Result;
use std::str::FromStr;

use tonic::{metadata::MetadataValue, transport::Channel};
use crate::{captcha_client::gocaptcha::{go_captcha_service_client::GoCaptchaServiceClient, GetDataRequest, StatusInfoRequest, StatusInfoResponse}, GetDataResponse};

pub mod gocaptcha {
    tonic::include_proto!("gocaptcha");
}

pub struct CaptchaClient {
    client: GoCaptchaServiceClient<Channel>,
}

impl CaptchaClient {
    /// 创建一个新的 CaptchaClient 实例
    pub async fn new(server_addr: &str) -> Result<Self> {
        let channel = Channel::from_shared(server_addr.to_string())?.connect().await?;
        let client = GoCaptchaServiceClient::new(channel);
        Ok(CaptchaClient { client })
    }

    /// 调用 CheckStatus 方法
    pub async fn check_status(&mut self, captcha_key: String, api_key: &str) -> Result<bool> {
        let mut request = tonic::Request::new(StatusInfoRequest {
            captcha_key: captcha_key,
        });
        // Add x-api-key to metadata
        let metadata = request.metadata_mut();
        metadata.insert("x-api-key", MetadataValue::from_str(api_key)?);
        let response = self.client.check_status(request).await?;
        println!("response: {:?}", response);
        Ok(response.into_inner().data.eq("ok"))
    }
}