use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::model::{erp_purchase_order, erp_supplier, erp_settlement_account};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "erp_inbound_order")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 入库订单ID

    pub order_number: i64, // 订单编号
    
    pub purchase_id: Option<i64>, // 采购订单ID
    
    pub supplier_id: i64, // 供应商ID

    pub user_id: i64, // 用户ID
    
    pub inbound_date: NaiveDateTime, // 入库日期
    
    pub remarks: Option<String>, // 备注
    
    pub discount_rate: Option<i64>, // 优惠率（百分比，1000表示10.00%）
    
    pub other_cost: Option<i64>, // 其他费用
    
    pub settlement_account_id: Option<i64>, // 结算账户ID
    
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
pub enum Relation {

    #[sea_orm(
        belongs_to = "super::erp_purchase_order::Entity",
        from = "Column::PurchaseId",
        to = "erp_purchase_order::Column::Id"
    )]
    InboundPurchase,

    #[sea_orm(
        belongs_to = "super::erp_supplier::Entity",
        from = "Column::SupplierId",
        to = "erp_supplier::Column::Id"
    )]
    InboundSupplier,

    #[sea_orm(
        belongs_to = "super::erp_settlement_account::Entity",
        from = "Column::SettlementAccountId",
        to = "erp_settlement_account::Column::Id"
    )]
    InboundSettlementAccount,
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