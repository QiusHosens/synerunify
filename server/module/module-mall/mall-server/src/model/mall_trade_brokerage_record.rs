use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_brokerage_record")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号
    
    pub user_id: i64, // 用户编号
    
    pub biz_id: String, // 业务编号
    
    pub biz_type: i8, // 业务类型：1-订单，2-提现
    
    pub title: String, // 标题
    
    pub price: i32, // 金额
    
    pub total_price: i32, // 当前总佣金
    
    pub description: String, // 说明
    
    pub status: i8, // 状态：0-待结算，1-已结算，2-已取消
    
    pub frozen_days: i32, // 冻结时间（天）
    
    pub unfreeze_time: Option<NaiveDateTime>, // 解冻时间
    
    pub source_user_level: i32, // 来源用户等级
    
    pub source_user_id: i64, // 来源用户编号
    
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