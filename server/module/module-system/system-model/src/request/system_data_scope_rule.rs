use serde::{Serialize, Deserialize};
use crate::model::system_data_scope_rule::{self, SystemDataScopeRule, SystemDataScopeRuleActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemDataScopeRuleRequest {
    
    pub r#type: i8, // 规则类型（0系统定义 1自定义）
    
    pub name: String, // 规则名称
    
    pub field: Option<String>, // 规则字段
    
    pub condition: Option<String>, // 规则条件
    
    pub value: Option<String>, // 规则值
    
}

impl CreateSystemDataScopeRuleRequest {
    pub fn to_active_model(&self) -> SystemDataScopeRuleActiveModel {
        SystemDataScopeRuleActiveModel {
            r#type: Set(self.r#type.clone()),
            name: Set(self.name.clone()),
            field: Set(self.field.clone()),
            condition: Set(self.condition.clone()),
            value: Set(self.value.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemDataScopeRuleRequest {
    
    pub id: i64, // id
    
    pub r#type: i8, // 规则类型（0系统定义 1自定义）
    
    pub name: String, // 规则名称
    
    pub field: Option<String>, // 规则字段
    
    pub condition: Option<String>, // 规则条件
    
    pub value: Option<String>, // 规则值
    
}

impl UpdateSystemDataScopeRuleRequest {
    pub fn to_active_model(&self, existing: SystemDataScopeRule) -> SystemDataScopeRuleActiveModel {
        let mut active_model: SystemDataScopeRuleActiveModel = existing.into();
        if let Some(r#type) = &self.r#type {
            active_model.r#type = Set(r#type.clone());
        }
        if let Some(name) = &self.name {
            active_model.name = Set(name.clone());
        }
        if let Some(field) = &self.field {
            active_model.field = Set(field.clone());
        }
        if let Some(condition) = &self.condition {
            active_model.condition = Set(condition.clone());
        }
        if let Some(value) = &self.value {
            active_model.value = Set(value.clone());
        }
        active_model
    }
}