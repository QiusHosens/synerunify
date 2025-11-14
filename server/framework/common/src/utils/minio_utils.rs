use anyhow::Error;
use chrono::{Datelike, Utc};
use minio::s3::{
    client::Client,
    creds::StaticProvider,
    http::BaseUrl, types::S3Api,
};

use crate::utils::snowflake_generator::SnowflakeGenerator;

pub const BUCKET_NAME: &str = "synerunify"; // 桶名

#[derive(Debug)]
pub enum MinioError {
    NotFound,
    Other(anyhow::Error),
}

impl From<anyhow::Error> for MinioError {
    fn from(err: anyhow::Error) -> Self {
        MinioError::Other(err)
    }
}

#[derive(Clone, Debug)]
pub struct MinioClient {
    client: Client,
}

impl MinioClient {
    pub async fn new(endpoint: &str, access_key: &str, secret_key: &str) -> anyhow::Result<Self> {
        let base_url = endpoint.parse::<BaseUrl>()?;
        let credentials = StaticProvider::new(access_key, secret_key, None);
        let client = Client::new(base_url, Some(Box::new(credentials)), None, None)?;
        
        // Check if bucket exists
        let response = client.list_buckets().send().await?;
        if !response.buckets.iter().any(|b| b.name == BUCKET_NAME) {
            // Create bucket if it doesn't exist
            client
                .create_bucket(BUCKET_NAME)
                .send()
                .await?;
        }

        Ok(MinioClient { client })
    }

    pub async fn upload_file(
        &self,
        file_name: &str,
        data: &[u8],
    ) -> Result<String, MinioError> {
        let now = Utc::now();
        let year = now.year();
        let month = format!("{:02}", now.month());
        let day = format!("{:02}", now.day());
        let generator = SnowflakeGenerator::new();
        let id = match generator.generate() {
            Ok(id) => id,
            Err(e) => return Err(MinioError::Other(Error::msg(e))),
        };
        let object_name = format!("{}/{}/{}/{}_{}", year, month, day, id, file_name);
        let owned_data: Vec<u8> = data.to_vec(); // Convert &[u8] to Vec<u8> to take ownership
        self.client
            .put_object_content(BUCKET_NAME, &object_name, owned_data)
            .send()
            .await
            .map_err(|e: minio::s3::error::Error| {
                if e.to_string().contains("NoSuchKey") {
                    MinioError::NotFound
                } else {
                    MinioError::Other(e.into())
                }
            })?;
        Ok(object_name)
    }

    pub async fn download_file(
        &self,
        object_name: String,
    ) -> Result<Vec<u8>, MinioError> {
        let response = self
            .client
            .get_object(BUCKET_NAME, &object_name)
            .send()
            .await
            .map_err(|e: minio::s3::error::Error| {
                if e.to_string().contains("NoSuchKey") {
                    MinioError::NotFound
                } else {
                    MinioError::Other(e.into())
                }
            })?;

        let data = response
            .content
            .to_segmented_bytes()
            .await
            .map_err(|e| MinioError::Other(e.into()))?
            .to_bytes()
            .to_vec();
        Ok(data)
    }

    pub async fn download_file_with_mime(
        &self,
        object_name: String,
    ) -> Result<(Vec<u8>, String), MinioError> {
        let response = self
            .client
            .get_object(BUCKET_NAME, &object_name)
            .send()
            .await
            .map_err(|e: minio::s3::error::Error| {
                if e.to_string().contains("NoSuchKey") {
                    MinioError::NotFound
                } else {
                    MinioError::Other(e.into())
                }
            })?;

        let content_type = response
            .headers
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("application/octet-stream")
            .to_string();

        let data = response
            .content
            .to_segmented_bytes()
            .await
            .map_err(|e| MinioError::Other(e.into()))?
            .to_bytes()
            .to_vec();
        Ok((data, content_type))
    }
}