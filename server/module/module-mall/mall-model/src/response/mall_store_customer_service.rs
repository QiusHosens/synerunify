use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallStoreCustomerServiceResponse {
    
    pub id: i64, // 客服编号
    
    pub store_id: i64, // 店铺编号
    
    pub user_id: i64, // 用户编号
    
    pub name: String, // 店铺名称
    
    pub r#type: i8, // 1-在线客服,2-电话,3-QQ,4-微信
    
    pub sort: i32, // 排序
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}