use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemRoleResponse {
    
    pub id: i64, // id
    
    pub r#type: i8, // 角色类型
    
    pub name: String, // 角色名称
    
    pub code: String, // 角色权限字符串
    
    pub status: i8, // 角色状态（0正常 1停用）
    
    pub sort: i32, // 显示顺序
    
    pub data_scope_rule_id: i64, // 数据权限规则id
    
    pub data_scope_department_ids: String, // 数据范围(指定部门数组)
    
    pub remark: Option<String>, // 备注
    
    pub creator: Option<i64>, // 创建者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}