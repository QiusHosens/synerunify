use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionBargainRecordResponse {
    
    pub id: i64, // 砍价记录编号
    
    pub activity_id: i64, // 砍价活动名称
    
    pub user_id: i64, // 用户编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub bargain_first_price: i32, // 砍价起始价格，单位：分
    
    pub bargain_price: i32, // 当前砍价，单位：分
    
    pub status: i8, // 状态
    
    pub order_id: Option<i64>, // 订单编号
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub end_time: NaiveDateTime, // 结束时间
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}