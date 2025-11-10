use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallStoreRequest {

    pub name: String, // 店铺名称
    
    pub short_name: Option<String>, // 店铺简称
    
    pub file_id: i64, // 店铺封面ID
    
    pub slider_file_ids: Option<String>, // 店铺轮播图id数组，以逗号分隔最多上传15张
    
    pub sort: Option<i32>, // 店铺排序
    
    pub slogan: Option<String>, // 店铺广告语
    
    pub description: Option<String>, // 店铺描述
    
    pub tags: Option<String>, // 店铺标签，逗号分隔，如：正品保障,7天无理由
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallStoreRequest {
    
    pub id: i64, // 店铺编号

    pub name: Option<String>, // 店铺名称
    
    pub short_name: Option<String>, // 店铺简称
    
    pub file_id: Option<i64>, // 店铺封面ID
    
    pub slider_file_ids: Option<String>, // 店铺轮播图id数组，以逗号分隔最多上传15张
    
    pub sort: Option<i32>, // 店铺排序
    
    pub slogan: Option<String>, // 店铺广告语
    
    pub description: Option<String>, // 店铺描述
    
    pub tags: Option<String>, // 店铺标签，逗号分隔，如：正品保障,7天无理由

}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct RejectMallStoreRequest {

    pub id: i64, // 店铺编号

    pub audit_remark: Option<String>, // 审核备注

}