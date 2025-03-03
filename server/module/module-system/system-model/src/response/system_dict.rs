use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemDictResponse {
    
    pub id: i64, // 主键
    
    pub category: String, // 类型
    
    pub category_name: String, // 类型名称
    
    pub code: String, // 编码
    
    pub name: String, // 名称
    
    pub remark: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
    pub creator: Option<String>, // 创建者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}