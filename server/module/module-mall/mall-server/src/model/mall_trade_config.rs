use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_config")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 自增主键
    
    pub after_sale_refund_reasons: String, // 售后退款理由
    
    pub after_sale_return_reasons: String, // 售后退货理由
    
    pub delivery_express_free_enabled: bool, // 是否启用全场包邮
    
    pub delivery_express_free_price: i32, // 全场包邮的最小金额，单位：分
    
    pub delivery_pick_up_enabled: bool, // 是否开启自提
    
    pub brokerage_enabled: bool, // 是否启用分佣
    
    pub brokerage_enabled_condition: i8, // 分佣模式：1-人人分销 2-指定分销
    
    pub brokerage_bind_mode: i8, // 分销关系绑定模式: 1-没有推广人，2-新用户, 3-扫码覆盖
    
    pub brokerage_poster_urls: Option<String>, // 分销海报图地址数组
    
    pub brokerage_first_percent: i32, // 一级返佣比例
    
    pub brokerage_second_percent: i32, // 二级返佣比例
    
    pub brokerage_withdraw_min_price: i32, // 用户提现最低金额
    
    pub brokerage_withdraw_fee_percent: i32, // 提现手续费百分比
    
    pub brokerage_frozen_days: i32, // 佣金冻结时间(天)
    
    pub brokerage_withdraw_types: String, // 提现方式：1-钱包；2-银行卡；3-微信；4-支付宝
    
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