use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "erp_warehouse")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 仓库ID
    
    pub name: String, // 仓库名称
    
    pub location: Option<String>, // 仓库位置
    
    pub status: i8, // 状态
    
    pub sort_order: i32, // 排序
    
    pub storage_fee: Option<i64>, // 仓储费
    
    pub handling_fee: Option<i64>, // 搬运费
    
    pub manager: Option<String>, // 负责人
    
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