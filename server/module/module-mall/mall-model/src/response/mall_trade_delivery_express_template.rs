use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use crate::response::mall_trade_delivery_express_template_charge::MallTradeDeliveryExpressTemplateChargeBaseResponse;
use crate::response::mall_trade_delivery_express_template_free::MallTradeDeliveryExpressTemplateFreeBaseResponse;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeDeliveryExpressTemplateResponse {
    
    pub id: i64, // 编号
    
    pub name: String, // 模板名称
    
    pub charge_mode: i8, // 配送计费方式
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态
    
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
pub struct MallTradeDeliveryExpressTemplateBaseResponse {

    pub id: i64, // 编号

    pub name: String, // 模板名称

    pub charge_mode: i8, // 配送计费方式

    pub sort: i32, // 排序

    pub status: i8, // 状态

    pub charges: Vec<MallTradeDeliveryExpressTemplateChargeBaseResponse>, // 运费列表

    pub frees: Vec<MallTradeDeliveryExpressTemplateFreeBaseResponse>, // 包邮列表

}