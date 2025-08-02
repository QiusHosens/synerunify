use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_seckill_product")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 秒杀参与商品编号
    
    pub activity_id: i64, // 秒杀活动 id
    
    pub config_ids: String, // 秒杀时段 id 数组
    
    pub spu_id: i64, // 商品 spu_id
    
    pub sku_id: i64, // 商品 sku_id
    
    pub seckill_price: i32, // 秒杀金额，单位：分
    
    pub stock: i32, // 秒杀库存
    
    pub activity_status: i8, // 秒杀商品状态
    
    pub activity_start_time: NaiveDateTime, // 活动开始时间点
    
    pub activity_end_time: NaiveDateTime, // 活动结束时间点
    
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