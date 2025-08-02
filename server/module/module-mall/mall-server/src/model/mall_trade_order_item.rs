use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_order_item")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 订单项编号
    
    pub user_id: i64, // 用户编号
    
    pub order_id: i64, // 订单编号
    
    pub cart_id: Option<i64>, // 购物车项编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub spu_name: String, // 商品 SPU 名称
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub properties: Option<String>, // 商品属性数组，JSON 格式
    
    pub pic_url: Option<String>, // 商品图片
    
    pub count: i32, // 购买数量
    
    pub comment_status: bool, // 是否评价
    
    pub price: i32, // 商品原价（单），单位：分
    
    pub discount_price: i32, // 商品级优惠（总），单位：分
    
    pub delivery_price: i32, // 运费金额，单位：分
    
    pub adjust_price: i32, // 订单调价（总），单位：分
    
    pub pay_price: i32, // 子订单实付金额（总），不算主订单分摊金额，单位：分
    
    pub coupon_price: i32, // 优惠劵减免金额，单位：分
    
    pub point_price: i32, // 积分抵扣的金额
    
    pub use_point: i32, // 使用的积分
    
    pub give_point: i32, // 赠送的积分
    
    pub vip_price: i32, // VIP 减免金额，单位：分
    
    pub after_sale_id: Option<i64>, // 售后订单编号
    
    pub after_sale_status: i32, // 售后状态
    
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