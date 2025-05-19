use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::model::{system_user, system_role};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "system_user_role")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // id
    
    pub user_id: i64, // 用户ID
    
    pub role_id: i64, // 角色ID
    
    pub creator: Option<i64>, // 创建者id
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者id
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {

    #[sea_orm(
        belongs_to = "super::system_user::Entity",
        from = "Column::UserId",
        to = "system_user::Column::Id"
    )]
    User,

    #[sea_orm(
        belongs_to = "super::system_role::Entity",
        from = "Column::RoleId",
        to = "system_role::Column::Id"
    )]
    Role,
}

impl Related<Entity> for Entity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveFilterEntityTrait for Entity {
    fn active_condition() -> Condition {
        Condition::all().add(Column::Deleted.eq(false))
    }
}

impl ActiveModelBehavior for ActiveModel {}