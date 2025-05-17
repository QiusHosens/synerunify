use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::model::system_user;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "system_department")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // id
    
    pub code: String, // 部门编码
    
    pub name: String, // 部门名称
    
    pub parent_id: i64, // 父部门id
    
    pub sort: i32, // 显示顺序
    
    pub leader_user_id: Option<i64>, // 负责人
    
    pub phone: Option<String>, // 联系电话
    
    pub email: Option<String>, // 邮箱
    
    pub status: i8, // 部门状态（0正常 1停用）
    
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
        from = "Column::LeaderUserId",
        to = "system_user::Column::Id"
    )]
    LeaderUser,
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