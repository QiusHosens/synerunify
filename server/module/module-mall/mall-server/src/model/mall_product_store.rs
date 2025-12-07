use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::model::{mall_store, mall_product_spu};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_product_store")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号
    
    pub product_id: i64, // 商品编号
    
    pub store_id: i64, // 店铺编号
    
    pub creator: Option<i64>, // 创建者ID
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {

    #[sea_orm(
        belongs_to = "super::mall_product_spu::Entity",
        from = "Column::ProductId",
        to = "mall_product_spu::Column::Id"
    )]
    Product,

    #[sea_orm(
        belongs_to = "super::mall_store::Entity",
        from = "Column::StoreId",
        to = "mall_store::Column::Id"
    )]
    Store,
}

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