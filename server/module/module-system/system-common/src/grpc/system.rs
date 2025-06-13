use anyhow::{anyhow, Result};
use common::config::config::Config;
use system_grpc::system_client::SystemClient;
use system_model::response::{system_department::SystemDepartmentBaseResponse, system_user::SystemUserBaseResponse};

pub struct GrpcSystemService {
    client: SystemClient,
}

impl GrpcSystemService {
    pub async fn new() -> Result<Self> {
        let config = Config::load();
        let client = SystemClient::new(&config.grpc_system_service_url)
            .await
            .map_err(|e| anyhow!("Failed to connect to gRPC service: {}", e))?;
        Ok(Self { client })
    }

    pub async fn get_user(&mut self, ids: Vec<i64>) -> Result<Vec<SystemUserBaseResponse>> {
        let result = self.client
            .get_user(ids, "")
            .await?;
        let users = result.list.into_iter().map(|user| SystemUserBaseResponse {
          id: user.id,
          nickname: user.nickname,
        }).collect();
        Ok(users)
    }

    pub async fn get_department(&mut self, ids: Vec<i64>) -> Result<Vec<SystemDepartmentBaseResponse>> {
        let result = self.client
            .get_department(ids, "")
            .await?;
        let departments = result.list.into_iter().map(|department| SystemDepartmentBaseResponse {
          id: department.id,
          code: "".to_string(),
          name: department.name,
        }).collect();
        Ok(departments)
    }
}