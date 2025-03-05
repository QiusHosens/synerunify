use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemDictTypeRequest {
    
    pub name: String, // 字典名称
    
    pub r#type: String, // 字典类型
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub deleted_time: Option<NaiveDateTime>, // 删除时间
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemDictTypeRequest {
    
    pub id: i64, // id
    
    pub name: Option<String>, // 字典名称
    
    pub r#type: Option<String>, // 字典类型
    
    pub status: Option<i8>, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub deleted_time: Option<NaiveDateTime>, // 删除时间
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}