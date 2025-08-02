use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionPointActivityResponse {
    
    pub id: i64, // 积分商城活动编号
    
    pub spu_id: i64, // 商品 SPU ID
    
    pub status: i8, // 活动状态
    
    pub remark: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
    pub stock: i32, // 积分商城活动库存(剩余库存积分兑换时扣减)
    
    pub total_stock: i32, // 积分商城活动总库存
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}