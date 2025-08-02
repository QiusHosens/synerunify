use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeBrokerageRecordRequest {
    
    pub user_id: i64, // 用户编号
    
    pub biz_id: String, // 业务编号
    
    pub biz_type: i8, // 业务类型：1-订单，2-提现
    
    pub title: String, // 标题
    
    pub price: i32, // 金额
    
    pub total_price: i32, // 当前总佣金
    
    pub description: String, // 说明
    
    pub status: i8, // 状态：0-待结算，1-已结算，2-已取消
    
    pub frozen_days: i32, // 冻结时间（天）
    
    #[schema(value_type = String, format = Date)]
    pub unfreeze_time: Option<NaiveDateTime>, // 解冻时间
    
    pub source_user_level: i32, // 来源用户等级
    
    pub source_user_id: i64, // 来源用户编号
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeBrokerageRecordRequest {
    
    pub id: i64, // 编号
    
    pub user_id: Option<i64>, // 用户编号
    
    pub biz_id: Option<String>, // 业务编号
    
    pub biz_type: Option<i8>, // 业务类型：1-订单，2-提现
    
    pub title: Option<String>, // 标题
    
    pub price: Option<i32>, // 金额
    
    pub total_price: Option<i32>, // 当前总佣金
    
    pub description: Option<String>, // 说明
    
    pub status: Option<i8>, // 状态：0-待结算，1-已结算，2-已取消
    
    pub frozen_days: Option<i32>, // 冻结时间（天）
    
    #[schema(value_type = String, format = Date)]
    pub unfreeze_time: Option<NaiveDateTime>, // 解冻时间
    
    pub source_user_level: Option<i32>, // 来源用户等级
    
    pub source_user_id: Option<i64>, // 来源用户编号
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}