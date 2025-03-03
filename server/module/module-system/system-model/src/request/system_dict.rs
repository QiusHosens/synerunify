
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemDictRequest {
    
    pub category: String, // 类型
    
    pub category_name: String, // 类型名称
    
    pub code: String, // 编码
    
    pub name: String, // 名称
    
    pub remark: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemDictRequest {
    
    pub id: i64, // 主键
    
    pub category: Option<String>, // 类型
    
    pub category_name: Option<String>, // 类型名称
    
    pub code: Option<String>, // 编码
    
    pub name: Option<String>, // 名称
    
    pub remark: Option<String>, // 备注
    
    pub sort: Option<i32>, // 排序
    
    pub status: Option<i8>, // 状态（0正常 1停用）
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}