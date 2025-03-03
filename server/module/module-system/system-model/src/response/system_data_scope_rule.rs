use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemDataScopeRuleResponse {
    
    pub id: i64, // id
    
    pub r#type: i8, // 规则类型（0系统定义 1自定义）
    
    pub name: String, // 规则名称
    
    pub field: Option<String>, // 规则字段
    
    pub condition: Option<String>, // 规则条件
    
    pub value: Option<String>, // 规则值
    
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