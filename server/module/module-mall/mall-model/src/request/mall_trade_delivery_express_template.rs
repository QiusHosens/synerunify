


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;
use crate::request::mall_trade_delivery_express_template_charge::{CreateMallTradeDeliveryExpressTemplateChargeRequest, UpdateMallTradeDeliveryExpressTemplateChargeRequest};
use crate::request::mall_trade_delivery_express_template_free::{CreateMallTradeDeliveryExpressTemplateFreeRequest, UpdateMallTradeDeliveryExpressTemplateFreeRequest};

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeDeliveryExpressTemplateRequest {
    
    pub name: String, // 模板名称
    
    pub charge_mode: i8, // 配送计费方式
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态

    pub charges: Vec<CreateMallTradeDeliveryExpressTemplateChargeRequest>, // 运费列表

    pub frees: Vec<CreateMallTradeDeliveryExpressTemplateFreeRequest>, // 包邮列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeDeliveryExpressTemplateRequest {
    
    pub id: i64, // 编号
    
    pub name: Option<String>, // 模板名称
    
    pub charge_mode: Option<i8>, // 配送计费方式
    
    pub sort: Option<i32>, // 排序
    
    pub status: Option<i8>, // 状态

    pub charges: Vec<UpdateMallTradeDeliveryExpressTemplateChargeRequest>, // 运费列表

    pub frees: Vec<UpdateMallTradeDeliveryExpressTemplateFreeRequest>, // 包邮列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}