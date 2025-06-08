use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "erp_suppliers")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 供应商ID
    
    pub supplier_name: String, // 供应商名称
    
    pub contact_person: Option<String>, // 联系人
    
    pub phone: Option<String>, // 电话
    
    pub email: Option<String>, // 邮箱
    
    pub address: Option<String>, // 地址
    
    pub status: i8, // 状态
    
    pub tax_id: Option<String>, // 纳税人识别号
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub bank_name: Option<String>, // 开户行
    
    pub bank_account: Option<String>, // 银行账号
    
    pub bank_address: Option<String>, // 开户地址
    
    pub remarks: Option<String>, // 备注
    
    pub sort_order: i32, // 排序
    
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