


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeDeliveryExpressTemplateRequest {
    
    pub name: String, // 模板名称
    
    pub charge_mode: i8, // 配送计费方式
    
    pub sort: i32, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeDeliveryExpressTemplateRequest {
    
    pub id: i64, // 编号
    
    pub name: Option<String>, // 模板名称
    
    pub charge_mode: Option<i8>, // 配送计费方式
    
    pub sort: Option<i32>, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}