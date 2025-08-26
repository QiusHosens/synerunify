use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use crate::response::mall_product_property_value::{MallProductPropertyValueBaseResponse};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductPropertyResponse {
    
    pub id: i64, // 编号
    
    pub name: Option<String>, // 名称
    
    pub status: i8, // 状态
    
    pub remark: Option<String>, // 备注
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductPropertyBaseResponse {

    pub id: i64, // 编号

    pub name: Option<String>, // 名称

    pub status: i8, // 状态

    pub remark: Option<String>, // 备注

    pub values: Vec<MallProductPropertyValueBaseResponse>, // 属性值列表

}