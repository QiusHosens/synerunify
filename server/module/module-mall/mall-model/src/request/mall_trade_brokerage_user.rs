use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeBrokerageUserRequest {
    
    pub bind_user_id: Option<i64>, // 推广员编号
    
    #[schema(value_type = String, format = Date)]
    pub bind_user_time: Option<NaiveDateTime>, // 推广员绑定时间
    
    pub brokerage_enabled: bool, // 是否成为推广员
    
    #[schema(value_type = String, format = Date)]
    pub brokerage_time: Option<NaiveDateTime>, // 成为分销员时间
    
    pub brokerage_price: i32, // 可用佣金
    
    pub frozen_price: i32, // 冻结佣金
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeBrokerageUserRequest {
    
    pub id: i64, // 用户编号
    
    pub bind_user_id: Option<i64>, // 推广员编号
    
    #[schema(value_type = String, format = Date)]
    pub bind_user_time: Option<NaiveDateTime>, // 推广员绑定时间
    
    pub brokerage_enabled: Option<bool>, // 是否成为推广员
    
    #[schema(value_type = String, format = Date)]
    pub brokerage_time: Option<NaiveDateTime>, // 成为分销员时间
    
    pub brokerage_price: Option<i32>, // 可用佣金
    
    pub frozen_price: Option<i32>, // 冻结佣金
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}