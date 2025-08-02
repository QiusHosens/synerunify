use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_coupon")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 优惠劵编号
    
    pub template_id: i64, // 优惠劵模板编号
    
    pub name: String, // 优惠劵名
    
    pub status: i8, // 优惠码状态     *     * 1-未使用     * 2-已使用     * 3-已失效
    
    pub user_id: i64, // 用户编号
    
    pub take_type: i8, // 领取类型     *     * 1 - 用户主动领取     * 2 - 后台自动发放
    
    pub use_price: i32, // 是否设置满多少金额可用，单位：分
    
    pub valid_start_time: NaiveDateTime, // 生效开始时间
    
    pub valid_end_time: NaiveDateTime, // 生效结束时间
    
    pub product_scope: i8, // 商品范围
    
    pub product_scope_values: Option<String>, // 商品范围编号的数组
    
    pub discount_type: i8, // 折扣类型
    
    pub discount_percent: Option<i8>, // 折扣百分比
    
    pub discount_price: Option<i32>, // 优惠金额，单位：分
    
    pub discount_limit_price: Option<i32>, // 折扣上限
    
    pub use_order_id: Option<i64>, // 使用订单号
    
    pub use_time: Option<NaiveDateTime>, // 使用时间
    
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