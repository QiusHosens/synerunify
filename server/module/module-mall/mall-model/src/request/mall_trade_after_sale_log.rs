


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeAfterSaleLogRequest {
    
    pub user_id: i64, // 用户编号
    
    pub user_type: i8, // 用户类型
    
    pub after_sale_id: i64, // 售后编号
    
    pub before_status: Option<i8>, // 售后状态（之前）
    
    pub after_status: i8, // 售后状态（之后）
    
    pub operate_type: i8, // 操作类型
    
    pub content: String, // 操作明细
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeAfterSaleLogRequest {
    
    pub id: i64, // 编号
    
    pub user_id: Option<i64>, // 用户编号
    
    pub user_type: Option<i8>, // 用户类型
    
    pub after_sale_id: Option<i64>, // 售后编号
    
    pub before_status: Option<i8>, // 售后状态（之前）
    
    pub after_status: Option<i8>, // 售后状态（之后）
    
    pub operate_type: Option<i8>, // 操作类型
    
    pub content: Option<String>, // 操作明细
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}