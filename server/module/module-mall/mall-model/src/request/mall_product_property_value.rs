


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductPropertyValueRequest {
    
    pub property_id: Option<i64>, // 属性项的编号
    
    pub name: Option<String>, // 名称
    
    pub status: i8, // 状态
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductPropertyValueRequest {
    
    pub id: i64, // 编号
    
    pub property_id: Option<i64>, // 属性项的编号
    
    pub name: Option<String>, // 名称
    
    pub status: Option<i8>, // 状态
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}