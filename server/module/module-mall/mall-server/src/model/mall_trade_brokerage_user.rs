use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_brokerage_user")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 用户编号
    
    pub bind_user_id: Option<i64>, // 推广员编号
    
    pub bind_user_time: Option<NaiveDateTime>, // 推广员绑定时间
    
    pub brokerage_enabled: bool, // 是否成为推广员
    
    pub brokerage_time: Option<NaiveDateTime>, // 成为分销员时间
    
    pub brokerage_price: i32, // 可用佣金
    
    pub frozen_price: i32, // 冻结佣金
    
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