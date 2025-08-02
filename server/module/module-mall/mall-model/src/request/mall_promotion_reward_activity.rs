use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionRewardActivityRequest {
    
    pub name: String, // 活动标题
    
    pub status: i8, // 活动状态
    
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 结束时间
    
    pub remark: Option<String>, // 备注
    
    pub condition_type: i8, // 条件类型
    
    pub product_scope: i8, // 商品范围
    
    pub product_scope_values: Option<String>, // 商品范围编号的数组
    
    pub rules: Option<String>, // 优惠规则的数组
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionRewardActivityRequest {
    
    pub id: i64, // 活动编号
    
    pub name: Option<String>, // 活动标题
    
    pub status: Option<i8>, // 活动状态
    
    #[schema(value_type = String, format = Date)]
    pub start_time: Option<NaiveDateTime>, // 开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: Option<NaiveDateTime>, // 结束时间
    
    pub remark: Option<String>, // 备注
    
    pub condition_type: Option<i8>, // 条件类型
    
    pub product_scope: Option<i8>, // 商品范围
    
    pub product_scope_values: Option<String>, // 商品范围编号的数组
    
    pub rules: Option<String>, // 优惠规则的数组
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}