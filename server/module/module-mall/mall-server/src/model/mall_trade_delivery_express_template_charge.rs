use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_delivery_express_template_charge")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号，自增
    
    pub template_id: i64, // 快递运费模板编号
    
    pub area_ids: String, // 配送区域 id
    
    pub charge_mode: i8, // 配送计费方式
    
    pub start_count: f64, // 首件数量
    
    pub start_price: i32, // 起步价，单位：分
    
    pub extra_count: f64, // 续件数量
    
    pub extra_price: i32, // 额外价，单位：分
    
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