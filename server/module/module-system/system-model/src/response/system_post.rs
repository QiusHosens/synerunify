use serde::{Serialize, Deserialize};
use serde_with::{serde_as, DisplayFromStr};
use sea_orm::sea_query::types::NaiveDateTime;
use crate::model::system_post::SystemPost;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemPostResponse {
    
    pub id: i64, // 职位ID
    
    pub code: String, // 职位编码
    
    pub name: String, // 职位名称
    
    pub sort: i32, // 显示顺序
    
    pub status: i8, // 状态（0正常 1停用）
    
    pub remark: Option<String>, // 备注
    
    pub creator: Option<String>, // 创建者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<String>, // 更新者
    
    #[serde_as(as = "DisplayFromStr")]
    #[serde(with = "serde_with::chrono::naive_datetime")]
    pub update_time: NaiveDateTime, // 更新时间
    
}

impl From<SystemPost> for SystemPostResponse {
    fn from(model: SystemPost) -> Self {
        Self {
            id: model.id,
            code: model.code,
            name: model.name,
            sort: model.sort,
            status: model.status,
            remark: model.remark,
            creator: model.creator,
            create_time: model.create_time,
            updater: model.updater,
            update_time: model.update_time,
            
        }
    }
}