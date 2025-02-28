use chrono::NaiveDateTime;
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "system_department")]
pub struct Model {
    
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64, // 部门id
    
    pub code: String, // 部门编码
    
    pub name: String, // 部门名称
    
    pub parent_id: i64, // 父部门id
    
    pub sort: i32, // 显示顺序
    
    pub leader_user_id: Option<i64>, // 负责人
    
    pub phone: Option<String>, // 联系电话
    
    pub email: Option<String>, // 邮箱
    
    pub status: i8, // 部门状态（0正常 1停用）
    
    pub creator: Option<String>, // 创建者
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
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

impl ActiveModelBehavior for ActiveModel {}