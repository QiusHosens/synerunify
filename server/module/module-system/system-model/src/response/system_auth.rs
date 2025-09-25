use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use crate::response::system_menu::HomeMenuResponse;

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct HomeResponse {
    pub nickname: String, // 用户昵称
    pub menus: Vec<HomeMenuResponse>, // 菜单列表
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct UserResponse {
    pub nickname: String, // 用户昵称

    pub remark: Option<String>, // 备注

    pub email: Option<String>, // 用户邮箱

    pub mobile: Option<String>, // 手机号码

    pub sex: Option<i8>, // 用户性别

    pub avatar: Option<String>, // 头像地址

    pub status: i8, // 帐号状态（0正常 1停用）
}