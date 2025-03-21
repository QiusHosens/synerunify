use serde::{Serialize, Deserialize};
use utoipa::ToSchema;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct HomeResponse {
    pub nickname: String, // 用户昵称
    pub menus: String, // 菜单列表
}