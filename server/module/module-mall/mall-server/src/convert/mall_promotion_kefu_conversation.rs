use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_kefu_conversation::{self, Model as MallPromotionKefuConversation, ActiveModel as MallPromotionKefuConversationActiveModel};
use mall_model::request::mall_promotion_kefu_conversation::{CreateMallPromotionKefuConversationRequest, UpdateMallPromotionKefuConversationRequest};
use mall_model::response::mall_promotion_kefu_conversation::MallPromotionKefuConversationResponse;

pub fn create_request_to_model(request: &CreateMallPromotionKefuConversationRequest) -> MallPromotionKefuConversationActiveModel {
    MallPromotionKefuConversationActiveModel {
        user_id: Set(request.user_id.clone()),
        last_message_time: Set(request.last_message_time.clone()),
        last_message_content: Set(request.last_message_content.clone()),
        last_message_content_type: Set(request.last_message_content_type.clone()),
        admin_pinned: Set(request.admin_pinned.clone()),
        user_deleted: Set(request.user_deleted.clone()),
        admin_deleted: Set(request.admin_deleted.clone()),
        admin_unread_message_count: Set(request.admin_unread_message_count.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionKefuConversationRequest, existing: MallPromotionKefuConversation) -> MallPromotionKefuConversationActiveModel {
    let mut active_model: MallPromotionKefuConversationActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(last_message_time) = &request.last_message_time { 
        active_model.last_message_time = Set(last_message_time.clone());
    }
    if let Some(last_message_content) = &request.last_message_content { 
        active_model.last_message_content = Set(last_message_content.clone());
    }
    if let Some(last_message_content_type) = &request.last_message_content_type { 
        active_model.last_message_content_type = Set(last_message_content_type.clone());
    }
    if let Some(admin_pinned) = &request.admin_pinned { 
        active_model.admin_pinned = Set(admin_pinned.clone());
    }
    if let Some(user_deleted) = &request.user_deleted { 
        active_model.user_deleted = Set(user_deleted.clone());
    }
    if let Some(admin_deleted) = &request.admin_deleted { 
        active_model.admin_deleted = Set(admin_deleted.clone());
    }
    if let Some(admin_unread_message_count) = &request.admin_unread_message_count { 
        active_model.admin_unread_message_count = Set(admin_unread_message_count.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionKefuConversation) -> MallPromotionKefuConversationResponse {
    MallPromotionKefuConversationResponse { 
        id: model.id,
        user_id: model.user_id,
        last_message_time: model.last_message_time,
        last_message_content: model.last_message_content,
        last_message_content_type: model.last_message_content_type,
        admin_pinned: model.admin_pinned,
        user_deleted: model.user_deleted,
        admin_deleted: model.admin_deleted,
        admin_unread_message_count: model.admin_unread_message_count,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}