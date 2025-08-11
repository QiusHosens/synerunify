use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionDiyTemplateRequest {
    
    pub name: String, // 模板名称
    
    pub used: bool, // 是否使用
    
    #[schema(value_type = String, format = Date)]
    pub used_time: Option<NaiveDateTime>, // 使用时间
    
    pub remark: Option<String>, // 备注
    
    pub preview_file_ids: Option<String>, // 预览图
    
    pub property: Option<String>, // 模板属性，JSON 格式
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionDiyTemplateRequest {
    
    pub id: i64, // 装修模板编号
    
    pub name: Option<String>, // 模板名称
    
    pub used: Option<bool>, // 是否使用
    
    #[schema(value_type = String, format = Date)]
    pub used_time: Option<NaiveDateTime>, // 使用时间
    
    pub remark: Option<String>, // 备注
    
    pub preview_file_ids: Option<String>, // 预览图
    
    pub property: Option<String>, // 模板属性，JSON 格式
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}