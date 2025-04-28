use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct SystemDictDataResponse {
    
    pub id: i64, // id
    
    pub sort: i32, // 字典排序
    
    pub label: String, // 字典标签
    
    pub value: String, // 字典键值
    
    pub dict_type: String, // 字典类型
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
    pub remark: Option<String>, // 备注
    
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
pub struct SystemDictDataDetailResponse {
    
    pub id: i64, // id
    
    pub sort: i32, // 字典排序
    
    pub label: String, // 字典标签
    
    pub value: String, // 字典键值
    
    pub dict_type: String, // 字典类型
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub color_type: Option<String>, // 颜色类型
    
    pub css_class: Option<String>, // css 样式
    
    pub remark: Option<String>, // 备注
    
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

    /************** 字典类型字段 *************/
    
    pub name: String, // 字典名称
    
    pub r#type: String, // 字典类型
    
    pub type_status: i8, // 状态（0正常 1停用）
    
    pub type_remark: Option<String>, // 备注
}