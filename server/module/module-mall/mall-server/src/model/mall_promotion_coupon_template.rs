use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_coupon_template")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 模板编号，自增唯一。
    
    pub name: String, // 优惠劵名
    
    pub description: Option<String>, // 优惠劵描述
    
    pub status: i8, // 状态
    
    pub total_count: i32, // 发放数量, -1 - 则表示不限制
    
    pub take_limit_count: i8, // 每人限领个数, -1 - 则表示不限制
    
    pub take_type: i8, // 领取方式
    
    pub use_price: i32, // 是否设置满多少金额可用，单位：分
    
    pub product_scope: i8, // 商品范围
    
    pub product_scope_values: Option<String>, // 商品范围编号的数组
    
    pub validity_type: i8, // 生效日期类型
    
    pub valid_start_time: Option<NaiveDateTime>, // 固定日期-生效开始时间
    
    pub valid_end_time: Option<NaiveDateTime>, // 固定日期-生效结束时间
    
    pub fixed_start_term: Option<i32>, // 领取日期-开始天数
    
    pub fixed_end_term: Option<i32>, // 领取日期-结束天数
    
    pub discount_type: i32, // 优惠类型：1-代金卷；2-折扣卷
    
    pub discount_percent: Option<i8>, // 折扣百分比
    
    pub discount_price: Option<i32>, // 优惠金额，单位：分
    
    pub discount_limit_price: Option<i32>, // 折扣上限，仅在 discount_type 等于 2 时生效
    
    pub take_count: i32, // 领取优惠券的数量
    
    pub use_count: i32, // 使用优惠券的次数
    
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