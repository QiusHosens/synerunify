use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "erp_product")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 产品ID
    
    pub product_code: Option<String>, // 产品编码
    
    pub product_name: String, // 产品名称
    
    pub category_id: Option<i64>, // 产品分类ID
    
    pub unit_id: i64, // 产品单位ID
    
    pub status: i8, // 状态
    
    pub barcode: Option<String>, // 条码
    
    pub specification: Option<String>, // 规格
    
    pub shelf_life_days: Option<i32>, // 保质期天数
    
    pub weight: Option<i32>, // 重量,kg,精确到百分位
    
    pub purchase_price: Option<i64>, // 采购价格
    
    pub sale_price: Option<i64>, // 销售价格
    
    pub min_price: Option<i64>, // 最低价格
    
    pub stock_quantity: i32, // 库存数量
    
    pub min_stock: i32, // 最低库存
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
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