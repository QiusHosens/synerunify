use chrono::NaiveDateTime;
use chrono::NaiveDate;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_product_statistics")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号，主键自增
    
    pub time: NaiveDate, // 统计日期
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub browse_count: i32, // 浏览量
    
    pub browse_user_count: i32, // 访客量
    
    pub favorite_count: i32, // 收藏数量
    
    pub cart_count: i32, // 加购数量
    
    pub order_count: i32, // 下单件数
    
    pub order_pay_count: i32, // 支付件数
    
    pub order_pay_price: i32, // 支付金额，单位：分
    
    pub after_sale_count: i32, // 退款件数
    
    pub after_sale_refund_price: i32, // 退款金额，单位：分
    
    pub browse_convert_percent: i32, // 访客支付转化率（百分比）
    
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