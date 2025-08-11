use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionDiyPageResponse {
    
    pub id: i64, // 装修页面编号
    
    pub template_id: Option<i64>, // 装修模板编号
    
    pub name: String, // 页面名称
    
    pub remark: Option<String>, // 备注
    
    pub preview_file_ids: Option<String>, // 预览图id,多个逗号分隔
    
    pub property: Option<String>, // 页面属性，JSON 格式
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}