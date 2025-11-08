


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallStoreCustomerServiceRequest {
    
    pub store_id: i64, // 店铺编号
    
    pub user_id: i64, // 用户编号
    
    pub name: String, // 店铺名称
    
    pub r#type: i8, // 1-在线客服,2-电话,3-QQ,4-微信
    
    pub sort: i32, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallStoreCustomerServiceRequest {
    
    pub id: i64, // 客服编号
    
    pub store_id: Option<i64>, // 店铺编号
    
    pub user_id: Option<i64>, // 用户编号
    
    pub name: Option<String>, // 店铺名称
    
    pub r#type: Option<i8>, // 1-在线客服,2-电话,3-QQ,4-微信
    
    pub sort: Option<i32>, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}