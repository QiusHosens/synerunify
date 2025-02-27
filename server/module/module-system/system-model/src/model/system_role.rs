use sea_orm::entity::prelude::*;
use sea_orm::sea_query::types::NaiveDateTime;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "system_role")]
pub struct SystemRole {
    
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i64, // 角色ID
    
    pub r#type: i8, // 角色类型
    
    pub name: String, // 角色名称
    
    pub code: String, // 角色权限字符串
    
    pub status: i8, // 角色状态（0正常 1停用）
    
    pub sort: i32, // 显示顺序
    
    pub data_scope_rule_id: i64, // 数据权限规则id
    
    pub data_scope_department_ids: String, // 数据范围(指定部门数组)
    
    pub remark: Option<String>, // 备注
    
    pub creator: Option<String>, // 创建者
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::system_role::Entity> for SystemRoleEntity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveModelBehavior for SystemRoleActiveModel {}