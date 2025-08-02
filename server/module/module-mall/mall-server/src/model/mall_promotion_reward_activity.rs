use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_reward_activity")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 活动编号
    
    pub name: String, // 活动标题
    
    pub status: i8, // 活动状态
    
    pub start_time: NaiveDateTime, // 开始时间
    
    pub end_time: NaiveDateTime, // 结束时间
    
    pub remark: Option<String>, // 备注
    
    pub condition_type: i8, // 条件类型
    
    pub product_scope: i8, // 商品范围
    
    pub product_scope_values: Option<String>, // 商品范围编号的数组
    
    pub rules: Option<String>, // 优惠规则的数组
    
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