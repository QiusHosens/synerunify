


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeDeliveryExpressTemplateFreeRequest {
    
    pub template_id: i64, // 快递运费模板编号
    
    pub area_ids: String, // 包邮区域 id
    
    pub free_price: i32, // 包邮金额，单位：分
    
    pub free_count: i32, // 包邮件数,
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeDeliveryExpressTemplateFreeRequest {
    
    pub id: i64, // 编号
    
    pub template_id: Option<i64>, // 快递运费模板编号
    
    pub area_ids: Option<String>, // 包邮区域 id
    
    pub free_price: Option<i32>, // 包邮金额，单位：分
    
    pub free_count: Option<i32>, // 包邮件数,
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}