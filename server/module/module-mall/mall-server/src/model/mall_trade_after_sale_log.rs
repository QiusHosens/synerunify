use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_after_sale_log")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号
    
    pub user_id: i64, // 用户编号
    
    pub user_type: i8, // 用户类型
    
    pub after_sale_id: i64, // 售后编号
    
    pub before_status: Option<i8>, // 售后状态（之前）
    
    pub after_status: i8, // 售后状态（之后）
    
    pub operate_type: i8, // 操作类型
    
    pub content: String, // 操作明细
    
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