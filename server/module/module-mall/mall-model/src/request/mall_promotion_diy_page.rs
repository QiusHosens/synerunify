


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionDiyPageRequest {
    
    pub template_id: Option<i64>, // 装修模板编号
    
    pub name: String, // 页面名称
    
    pub remark: Option<String>, // 备注
    
    pub preview_file_ids: Option<String>, // 预览图id,多个逗号分隔
    
    pub property: Option<String>, // 页面属性，JSON 格式
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionDiyPageRequest {
    
    pub id: i64, // 装修页面编号
    
    pub template_id: Option<i64>, // 装修模板编号
    
    pub name: Option<String>, // 页面名称
    
    pub remark: Option<String>, // 备注
    
    pub preview_file_ids: Option<String>, // 预览图id,多个逗号分隔
    
    pub property: Option<String>, // 页面属性，JSON 格式
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}