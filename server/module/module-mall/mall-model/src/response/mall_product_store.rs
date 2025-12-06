use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductStoreResponse {
    
    pub id: i64, // 编号
    
    pub product_id: i64, // 商品编号
    
    pub store_id: i64, // 店铺编号
    
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
pub struct MallProductStoreNameResponse {

    pub id: i64, // 编号

    pub product_id: i64, // 商品编号

    pub store_id: i64, // 店铺编号

    pub store_name: String, // 店铺名称

}