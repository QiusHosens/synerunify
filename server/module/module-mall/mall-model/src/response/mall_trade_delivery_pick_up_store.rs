use chrono::NaiveDateTime;
use chrono::NaiveTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeDeliveryPickUpStoreResponse {
    
    pub id: i64, // 编号
    
    pub name: String, // 门店名称
    
    pub introduction: Option<String>, // 门店简介
    
    pub phone: String, // 门店手机
    
    pub area_id: i32, // 区域编号
    
    pub detail_address: String, // 门店详细地址
    
    pub logo: String, // 门店 logo
    
    #[serde_as(as = "common::formatter::string_date_time::StringTime")]
    #[schema(value_type = String, format = Date)]
    pub opening_time: NaiveTime, // 营业开始时间
    
    #[serde_as(as = "common::formatter::string_date_time::StringTime")]
    #[schema(value_type = String, format = Date)]
    pub closing_time: NaiveTime, // 营业结束时间
    
    pub latitude: f64, // 纬度
    
    pub longitude: f64, // 经度
    
    pub verify_user_ids: Option<String>, // 核销用户编号数组
    
    pub status: i8, // 门店状态
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}