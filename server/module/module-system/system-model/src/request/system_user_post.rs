
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemUserPostRequest {
    
    pub user_id: i64, // 用户ID
    
    pub post_id: i64, // 职位ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemUserPostRequest {
    
    pub id: i64, // id
    
    pub user_id: Option<i64>, // 用户ID
    
    pub post_id: Option<i64>, // 职位ID
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}