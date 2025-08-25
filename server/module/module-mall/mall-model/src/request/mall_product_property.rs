


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;
use crate::request::mall_product_property_value::{CreateMallProductPropertyValueRequest, UpdateMallProductPropertyValueRequest};

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductPropertyRequest {
    
    pub name: Option<String>, // 名称
    
    pub status: i8, // 状态
    
    pub remark: Option<String>, // 备注

    pub values: Vec<CreateMallProductPropertyValueRequest>, // 属性值列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductPropertyRequest {
    
    pub id: i64, // 编号
    
    pub name: Option<String>, // 名称
    
    pub status: Option<i8>, // 状态
    
    pub remark: Option<String>, // 备注

    pub values: Vec<UpdateMallProductPropertyValueRequest>, // 属性值列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}