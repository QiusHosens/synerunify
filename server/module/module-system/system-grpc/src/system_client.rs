use anyhow::Result;
use std::str::FromStr;

use tonic::{metadata::MetadataValue, transport::Channel};
use crate::{system_client::system::{system_service_client::SystemServiceClient, GetUserRequest, GetUserResponse, GetDepartmentRequest, GetDepartmentResponse}};

pub mod system {
    tonic::include_proto!("system");
}

pub struct SystemClient {
    client: SystemServiceClient<Channel>,
}

impl SystemClient {
    /// 创建一个新的 SystemClient 实例
    pub async fn new(server_addr: &str) -> Result<Self> {
        let channel = Channel::from_shared(server_addr.to_string())?.connect().await?;
        let client = SystemServiceClient::new(channel);
        Ok(SystemClient { client })
    }

    /// 调用 GetUser 方法
    pub async fn get_user(&mut self, user_id_list: Vec<i64>, authorization: &str) -> Result<GetUserResponse> {
        let mut request = tonic::Request::new(GetUserRequest {
            id: user_id_list,
        });
        // Add authorization to metadata
        let metadata = request.metadata_mut();
        metadata.insert("authorization", MetadataValue::from_str(authorization)?);
        let response = self.client.get_user(request).await?;
        println!("response: {:?}", response);
        Ok(response.into_inner())
    }

    /// 调用 GetDepartment 方法
    pub async fn get_department(&mut self, department_id_list: Vec<i64>, authorization: &str) -> Result<GetDepartmentResponse> {
        let mut request = tonic::Request::new(GetDepartmentRequest {
            id: department_id_list,
        });
        // Add authorization to metadata
        let metadata = request.metadata_mut();
        metadata.insert("authorization", MetadataValue::from_str(authorization)?);
        let response = self.client.get_department(request).await?;
        println!("response: {:?}", response);
        Ok(response.into_inner())
    }
}