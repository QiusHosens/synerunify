use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeBrokerageRecordResponse {
    
    pub id: i64, // 编号
    
    pub user_id: i64, // 用户编号
    
    pub biz_id: String, // 业务编号
    
    pub biz_type: i8, // 业务类型：1-订单，2-提现
    
    pub title: String, // 标题
    
    pub price: i32, // 金额
    
    pub total_price: i32, // 当前总佣金
    
    pub description: String, // 说明
    
    pub status: i8, // 状态：0-待结算，1-已结算，2-已取消
    
    pub frozen_days: i32, // 冻结时间（天）
    
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub unfreeze_time: Option<NaiveDateTime>, // 解冻时间
    
    pub source_user_level: i32, // 来源用户等级
    
    pub source_user_id: i64, // 来源用户编号
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}