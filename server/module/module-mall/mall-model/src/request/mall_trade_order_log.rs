


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeOrderLogRequest {
    
    pub user_id: i64, // 用户编号
    
    pub user_type: i8, // 用户类型
    
    pub order_id: i64, // 订单号
    
    pub before_status: Option<i8>, // 操作前状态
    
    pub after_status: Option<i8>, // 操作后状态
    
    pub operate_type: i32, // 操作类型
    
    pub content: String, // 操作内容
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeOrderLogRequest {
    
    pub id: i64, // 日志主键
    
    pub user_id: Option<i64>, // 用户编号
    
    pub user_type: Option<i8>, // 用户类型
    
    pub order_id: Option<i64>, // 订单号
    
    pub before_status: Option<i8>, // 操作前状态
    
    pub after_status: Option<i8>, // 操作后状态
    
    pub operate_type: Option<i32>, // 操作类型
    
    pub content: Option<String>, // 操作内容
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}