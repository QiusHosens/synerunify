use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::model::{erp_product, erp_warehouse};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "erp_product_inventory")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 产品库存ID
    
    pub product_id: i64, // 产品ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub stock_quantity: i32, // 库存数量
    
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
        belongs_to = "super::erp_product::Entity",
        from = "Column::ProductId",
        to = "erp_product::Column::Id"
    )]
    InventoryProduct,

    #[sea_orm(
        belongs_to = "super::erp_warehouse::Entity",
        from = "Column::WarehouseId",
        to = "erp_warehouse::Column::Id"
    )]
    InventoryWarehouse,
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