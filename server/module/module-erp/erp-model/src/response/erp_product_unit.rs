use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpProductUnitResponse {
    
    pub id: i64, // 单位ID
    
    pub unit_name: String, // 单位名称
    
    pub status: i8, // 状态
    
    pub sort: i32, // 排序
    
    pub remarks: Option<String>, // 备注
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}