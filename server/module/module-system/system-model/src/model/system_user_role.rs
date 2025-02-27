use sea_orm::entity::prelude::*;
use sea_orm::sea_query::types::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "system_user_role")]
pub struct SystemUserRole {
    
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64, // id
    
    pub user_id: i64, // 用户ID
    
    pub role_id: i64, // 角色ID
    
    pub creator: Option<String>, // 创建者
    
    pub create_time: Option<NaiveDateTime>, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    pub update_time: Option<NaiveDateTime>, // 更新时间
    
    pub deleted: Option<bool>, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::system_user_role::Entity> for SystemUserRoleEntity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveModelBehavior for SystemUserRoleActiveModel {}