use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemDepartmentResponse {
    
    pub id: i64, // id
    
    pub code: String, // 部门编码
    
    pub name: String, // 部门名称
    
    pub parent_id: i64, // 父部门id
    
    pub sort: i32, // 显示顺序
    
    pub leader_user_id: Option<i64>, // 负责人
    
    pub phone: Option<String>, // 联系电话
    
    pub email: Option<String>, // 邮箱
    
    pub status: i8, // 部门状态（0正常 1停用）
    
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