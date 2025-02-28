use sea_orm::entity::prelude::*;
use sea_orm::sea_query::types::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "system_tenant_package")]
pub struct SystemTenantPackage {
    
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64, // 套餐编号
    
    pub name: String, // 套餐名
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub menu_ids: String, // 关联的菜单编号
    
    pub creator: String, // 创建者
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::system_tenant_package::Entity> for SystemTenantPackageEntity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveModelBehavior for SystemTenantPackageActiveModel {}