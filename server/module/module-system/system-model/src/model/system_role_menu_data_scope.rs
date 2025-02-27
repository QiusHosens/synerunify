use sea_orm::entity::prelude::*;
use sea_orm::sea_query::types::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "system_role_menu_data_scope")]
pub struct SystemRoleMenuDataScope {
    
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64, // id
    
    pub role_menu_id: i64, // 角色菜单ID
    
    pub data_scope_rule_id: i64, // 权限规则ID
    
    pub creator: Option<String>, // 创建者
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::system_role_menu_data_scope::Entity> for SystemRoleMenuDataScopeEntity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveModelBehavior for SystemRoleMenuDataScopeActiveModel {}