use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use crate::response::system_menu::HomeMenuResponse;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct HomeResponse {
    pub nickname: String, // 用户昵称
    pub menus: Vec<HomeMenuResponse>, // 菜单列表
}