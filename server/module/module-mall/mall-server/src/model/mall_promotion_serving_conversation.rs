use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_serving_conversation")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号
    
    pub user_id: i64, // 会话所属用户
    
    pub last_message_time: NaiveDateTime, // 最后聊天时间
    
    pub last_message_content: String, // 最后聊天内容
    
    pub last_message_content_type: i32, // 最后发送的消息类型
    
    pub admin_pinned: bool, // 管理端置顶
    
    pub user_deleted: bool, // 用户是否可见
    
    pub admin_deleted: bool, // 管理员是否可见
    
    pub admin_unread_message_count: i32, // 管理员未读消息数
    
    pub creator: Option<i64>, // 创建者ID
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
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