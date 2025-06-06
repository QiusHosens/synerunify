
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct LoginRequest {

    pub username: String, // 用户账号

    pub password: String, // 密码

    pub captcha_key: String, // 验证码key
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct RefreshTokenRequest {

    pub refresh_token: String, // 刷新token

}