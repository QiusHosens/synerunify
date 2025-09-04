


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeDeliveryExpressTemplateChargeRequest {
    
    pub area_ids: String, // 配送区域 id

    pub charge_mode: i8, // 配送计费方式
    
    pub start_count: i32, // 首件数量
    
    pub start_price: i32, // 起步价，单位：分
    
    pub extra_count: i32, // 续件数量
    
    pub extra_price: i32, // 额外价，单位：分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeDeliveryExpressTemplateChargeRequest {
    
    pub id: Option<i64>, // 编号，自增
    
    pub area_ids: String, // 配送区域 id
    
    pub charge_mode: i8, // 配送计费方式
    
    pub start_count: i32, // 首件数量
    
    pub start_price: i32, // 起步价，单位：分
    
    pub extra_count: i32, // 续件数量
    
    pub extra_price: i32, // 额外价，单位：分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}