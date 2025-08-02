use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_point_activity")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 积分商城活动编号
    
    pub spu_id: i64, // 商品 SPU ID
    
    pub status: i8, // 活动状态
    
    pub remark: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
    pub stock: i32, // 积分商城活动库存(剩余库存积分兑换时扣减)
    
    pub total_stock: i32, // 积分商城活动总库存
    
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