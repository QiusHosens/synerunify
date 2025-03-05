
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateSystemMenuRequest {
    
    pub name: String, // 菜单名称
    
    pub permission: String, // 权限标识
    
    pub r#type: i8, // 菜单类型
    
    pub sort: i32, // 显示顺序
    
    pub parent_id: i64, // 父菜单ID
    
    pub path: Option<String>, // 路由地址
    
    pub icon: Option<String>, // 菜单图标
    
    pub component: Option<String>, // 组件路径
    
    pub component_name: Option<String>, // 组件名
    
    pub status: i8, // 菜单状态
    
    pub visible: bool, // 是否可见
    
    pub keep_alive: bool, // 是否缓存
    
    pub always_show: bool, // 是否总是显示
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateSystemMenuRequest {
    
    pub id: i64, // id
    
    pub name: Option<String>, // 菜单名称
    
    pub permission: Option<String>, // 权限标识
    
    pub r#type: Option<i8>, // 菜单类型
    
    pub sort: Option<i32>, // 显示顺序
    
    pub parent_id: Option<i64>, // 父菜单ID
    
    pub path: Option<String>, // 路由地址
    
    pub icon: Option<String>, // 菜单图标
    
    pub component: Option<String>, // 组件路径
    
    pub component_name: Option<String>, // 组件名
    
    pub status: Option<i8>, // 菜单状态
    
    pub visible: Option<bool>, // 是否可见
    
    pub keep_alive: Option<bool>, // 是否缓存
    
    pub always_show: Option<bool>, // 是否总是显示
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}