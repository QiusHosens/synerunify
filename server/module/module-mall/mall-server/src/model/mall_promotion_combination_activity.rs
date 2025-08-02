use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_combination_activity")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 活动编号
    
    pub name: String, // 拼团名称
    
    pub spu_id: i64, // 商品 SPU ID
    
    pub total_limit_count: i32, // 总限购数量
    
    pub single_limit_count: i32, // 单次限购数量
    
    pub start_time: NaiveDateTime, // 开始时间
    
    pub end_time: NaiveDateTime, // 结束时间
    
    pub user_size: Option<i32>, // 购买人数
    
    pub virtual_group: i32, // 虚拟成团
    
    pub status: i8, // 状态
    
    pub limit_duration: i32, // 限制时长（小时）
    
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