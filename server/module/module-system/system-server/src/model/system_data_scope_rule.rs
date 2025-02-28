use sea_orm::entity::prelude::*;
use sea_orm::sea_query::types::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "system_data_scope_rule")]
pub struct SystemDataScopeRule {
    
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64, // id
    
    pub r#type: i8, // 规则类型（0系统定义 1自定义）
    
    pub name: String, // 规则名称
    
    pub field: Option<String>, // 规则字段
    
    pub condition: Option<String>, // 规则条件
    
    pub value: Option<String>, // 规则值
    
    pub creator: Option<String>, // 创建者
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::system_data_scope_rule::Entity> for SystemDataScopeRuleEntity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveModelBehavior for SystemDataScopeRuleActiveModel {}