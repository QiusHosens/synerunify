use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_data_scope_rule::SystemDataScopeRule;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemDataScopeRuleResponse {
    
    pub id: i64, // id
    
    pub r#type: i8, // 规则类型（0系统定义 1自定义）
    
    pub name: String, // 规则名称
    
    pub field: Option<String>, // 规则字段
    
    pub condition: Option<String>, // 规则条件
    
    pub value: Option<String>, // 规则值
    
    pub creator: Option<String>, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemDataScopeRule> for SystemDataScopeRuleResponse {
    fn from(model: SystemDataScopeRule) -> Self {
        Self {
            id: model.id,
            r#type: model.r#type,
            name: model.name,
            field: model.field,
            condition: model.condition,
            value: model.value,
            creator: model.creator,
            create_time: model.create_time,
            updater: model.updater,
            update_time: model.update_time,
            
        }
    }
}