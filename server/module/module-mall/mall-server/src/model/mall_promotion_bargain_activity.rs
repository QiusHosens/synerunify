use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_bargain_activity")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 砍价活动编号
    
    pub name: String, // 砍价活动名称
    
    pub start_time: NaiveDateTime, // 活动开始时间
    
    pub end_time: NaiveDateTime, // 活动结束时间
    
    pub status: i8, // 状态
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub bargain_first_price: i32, // 砍价起始价格，单位分
    
    pub bargain_min_price: i32, // 砍价底价，单位：分
    
    pub stock: i32, // 砍价库存
    
    pub total_stock: i32, // 砍价总库存
    
    pub help_max_count: i32, // 砍价人数
    
    pub bargain_count: i32, // 最大帮砍次数
    
    pub total_limit_count: i32, // 总限购数量
    
    pub random_min_price: i32, // 用户每次砍价的最小金额，单位：分
    
    pub random_max_price: i32, // 用户每次砍价的最大金额，单位：分
    
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