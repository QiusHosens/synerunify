
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemDictDataRequest {
    
    pub sort: i32, // 字典排序
    
    pub label: String, // 字典标签
    
    pub value: String, // 字典键值
    
    pub dict_type: String, // 字典类型
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemDictDataRequest {
    
    pub id: i64, // id
    
    pub sort: Option<i32>, // 字典排序
    
    pub label: Option<String>, // 字典标签
    
    pub value: Option<String>, // 字典键值
    
    pub dict_type: Option<String>, // 字典类型
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
    pub remark: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}