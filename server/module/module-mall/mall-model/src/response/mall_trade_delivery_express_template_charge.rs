use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeDeliveryExpressTemplateChargeResponse {
    
    pub id: i64, // 编号，自增
    
    pub template_id: i64, // 快递运费模板编号
    
    pub area_ids: String, // 配送区域 id
    
    pub charge_mode: i8, // 配送计费方式
    
    pub start_count: i32, // 首件数量
    
    pub start_price: i32, // 起步价，单位：分
    
    pub extra_count: i32, // 续件数量
    
    pub extra_price: i32, // 额外价，单位：分
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeDeliveryExpressTemplateChargeBaseResponse {

    pub id: i64, // 编号，自增

    pub template_id: i64, // 快递运费模板编号

    pub area_ids: String, // 配送区域 id

    pub charge_mode: i8, // 配送计费方式

    pub start_count: i32, // 首件数量

    pub start_price: i32, // 起步价，单位：分

    pub extra_count: i32, // 续件数量

    pub extra_price: i32, // 额外价，单位：分

}