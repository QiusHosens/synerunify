use serde::{Serialize, Deserialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct AreaResponse {
    pub id: i32, // 区域ID
    pub name: String, // 区域名称
    pub area_type: i32, // 区域类型
    pub parent_id: i32, // 父级区域ID
    #[serde(skip_serializing, skip_deserializing)]
    pub children: Option<Vec<AreaResponse>>, // 子区域列表
}