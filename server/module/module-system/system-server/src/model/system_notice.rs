use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "system_notice")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // id
    
    pub title: String, // 公告标题
    
    pub content: String, // 公告内容
    
    pub r#type: i8, // 公告类型（1通知 2公告）
    
    pub status: i8, // 公告状态（0正常 1关闭）
    
    pub creator: Option<i64>, // 创建者id
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者id
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

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