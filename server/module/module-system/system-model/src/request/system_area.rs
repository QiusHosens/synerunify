use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct QueryRequest {
    pub keyword: Option<String>, // 区域名称关键词（模糊搜索）
    pub area_type: Option<i32>, // 区域类型
    pub parent_id: Option<i32>, // 父级区域ID
    pub include_children: Option<bool>, // 是否包含子区域
}