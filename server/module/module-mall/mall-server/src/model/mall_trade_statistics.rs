use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_statistics")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号，主键自增
    
    pub time: NaiveDateTime, // 统计日期
    
    pub order_create_count: i32, // 创建订单数
    
    pub order_pay_count: i32, // 支付订单商品数
    
    pub order_pay_price: i32, // 总支付金额，单位：分
    
    pub after_sale_count: i32, // 退款订单数
    
    pub after_sale_refund_price: i32, // 总退款金额，单位：分
    
    pub brokerage_settlement_price: i32, // 佣金金额（已结算），单位：分
    
    pub wallet_pay_price: i32, // 总支付金额（余额），单位：分
    
    pub recharge_pay_count: i32, // 充值订单数
    
    pub recharge_pay_price: i32, // 充值金额，单位：分
    
    pub recharge_refund_count: i32, // 充值退款订单数
    
    pub recharge_refund_price: i32, // 充值退款金额，单位：分
    
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