use sea_orm::entity::prelude::*;
use sea_orm::sea_query::types::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "system_tenant")]
pub struct SystemTenant {
    
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64, // 租户编号
    
    pub name: String, // 租户名
    
    pub contact_user_id: Option<i64>, // 联系人的用户编号
    
    pub contact_name: String, // 联系人
    
    pub contact_mobile: Option<String>, // 联系手机
    
    pub status: i8, // 租户状态（0正常 1停用）
    
    pub website: Option<String>, // 绑定域名
    
    pub package_id: i64, // 租户套餐编号
    
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub account_count: i32, // 账号数量
    
    pub creator: String, // 创建者
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除,0:未删除;1:已删除
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::system_tenant::Entity> for SystemTenantEntity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveModelBehavior for SystemTenantActiveModel {}