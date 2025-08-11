use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionBannerResponse {
    
    pub id: i64, // Banner 编号
    
    pub title: String, // Banner 标题
    
    pub file_id: i64, // 图片ID
    
    pub url: String, // 跳转地址
    
    pub status: i8, // 状态
    
    pub sort: Option<i32>, // 排序
    
    pub position: i8, // 位置
    
    pub memo: Option<String>, // 描述
    
    pub browse_count: Option<i32>, // Banner 点击次数
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}