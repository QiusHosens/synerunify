use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateSystemUserPostRequest {
    
    pub user_id: i64, // 用户ID
    
    pub post_id: i64, // 职位ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateSystemUserPostRequest {
    
    pub id: i64, // id
    
    pub user_id: Option<i64>, // 用户ID
    
    pub post_id: Option<i64>, // 职位ID
    
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}