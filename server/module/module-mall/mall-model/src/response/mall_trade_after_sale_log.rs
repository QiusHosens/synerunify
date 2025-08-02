use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeAfterSaleLogResponse {
    
    pub id: i64, // 编号
    
    pub user_id: i64, // 用户编号
    
    pub user_type: i8, // 用户类型
    
    pub after_sale_id: i64, // 售后编号
    
    pub before_status: Option<i8>, // 售后状态（之前）
    
    pub after_status: i8, // 售后状态（之后）
    
    pub operate_type: i8, // 操作类型
    
    pub content: String, // 操作明细
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}