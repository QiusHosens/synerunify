use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemMenuResponse {
    
    pub id: i64, // id
    
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
    
    pub creator: Option<i64>, // 创建者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者id
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}

#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct HomeMenuResponse {

    pub id: i64, // id

    pub name: String, // 菜单名称

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