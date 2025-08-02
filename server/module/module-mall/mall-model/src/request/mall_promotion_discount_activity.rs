use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionDiscountActivityRequest {
    
    pub name: String, // 活动标题
    
    pub status: i8, // 活动状态
    
    #[schema(value_type = String, format = Date)]
    pub start_time: NaiveDateTime, // 开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 结束时间
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionDiscountActivityRequest {
    
    pub id: i64, // 活动编号
    
    pub name: Option<String>, // 活动标题
    
    pub status: Option<i8>, // 活动状态
    
    #[schema(value_type = String, format = Date)]
    pub start_time: Option<NaiveDateTime>, // 开始时间
    
    #[schema(value_type = String, format = Date)]
    pub end_time: Option<NaiveDateTime>, // 结束时间
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}