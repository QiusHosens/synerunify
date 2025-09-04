use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeDeliveryExpressTemplateFreeResponse {
    
    pub id: i64, // 编号
    
    pub template_id: i64, // 快递运费模板编号
    
    pub area_ids: String, // 包邮区域 id
    
    pub free_price: i32, // 包邮金额，单位：分
    
    pub free_count: i32, // 包邮件数,
    
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
pub struct MallTradeDeliveryExpressTemplateFreeBaseResponse {

    pub id: i64, // 编号

    pub template_id: i64, // 快递运费模板编号

    pub area_ids: String, // 包邮区域 id

    pub free_price: i32, // 包邮金额，单位：分

    pub free_count: i32, // 包邮件数,

}