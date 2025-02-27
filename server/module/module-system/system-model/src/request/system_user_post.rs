use serde::{Serialize, Deserialize};
use crate::model::system_user_post::{self, SystemUserPost, SystemUserPostActiveModel};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateSystemUserPostRequest {
    
    pub user_id: i64, // 用户ID
    
    pub post_id: i64, // 职位ID
    
}

impl CreateSystemUserPostRequest {
    pub fn to_active_model(&self) -> SystemUserPostActiveModel {
        SystemUserPostActiveModel {
            user_id: Set(self.user_id.clone()),
            post_id: Set(self.post_id.clone()),
            ..Default::default()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateSystemUserPostRequest {
    
    pub id: i64, // id
    
    pub user_id: i64, // 用户ID
    
    pub post_id: i64, // 职位ID
    
}

impl UpdateSystemUserPostRequest {
    pub fn to_active_model(&self, existing: SystemUserPost) -> SystemUserPostActiveModel {
        let mut active_model: SystemUserPostActiveModel = existing.into();
        if let Some(user_id) = &self.user_id {
            active_model.user_id = Set(user_id.clone());
        }
        if let Some(post_id) = &self.post_id {
            active_model.post_id = Set(post_id.clone());
        }
        active_model
    }
}