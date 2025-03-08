
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct LoginRequest {

    pub username: String, // 用户账号

    pub password: String, // 密码
    
}