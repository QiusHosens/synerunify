


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeDeliveryExpressRequest {
    
    pub code: String, // 快递公司编码
    
    pub name: String, // 快递公司名称
    
    pub logo: Option<String>, // 快递公司 logo
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeDeliveryExpressRequest {
    
    pub id: i64, // 编号
    
    pub code: Option<String>, // 快递公司编码
    
    pub name: Option<String>, // 快递公司名称
    
    pub logo: Option<String>, // 快递公司 logo
    
    pub sort: Option<i32>, // 排序
    
    pub status: Option<i8>, // 状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}