use serde::{Serialize, Deserialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AreaResponse {
    pub id: i32, // 区域ID
    pub name: String, // 区域名称
    pub area_type: i32, // 区域类型
    pub parent_id: i32, // 父级区域ID
    #[schema(no_recursion, nullable = true)]
    pub children: Option<Vec<AreaResponse>>, // 子区域列表
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AreaPathResponse {
    pub id: i32, // 区域ID
    pub name: String, // 区域名称
    pub path: String, // 完整路径
}