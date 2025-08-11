use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_serving_message::{self, Model as MallPromotionServingMessage, ActiveModel as MallPromotionServingMessageActiveModel};
use mall_model::request::mall_promotion_serving_message::{CreateMallPromotionServingMessageRequest, UpdateMallPromotionServingMessageRequest};
use mall_model::response::mall_promotion_serving_message::MallPromotionServingMessageResponse;

pub fn create_request_to_model(request: &CreateMallPromotionServingMessageRequest) -> MallPromotionServingMessageActiveModel {
    MallPromotionServingMessageActiveModel {
        conversation_id: Set(request.conversation_id.clone()),
        sender_id: Set(request.sender_id.clone()),
        sender_type: Set(request.sender_type.clone()),
        receiver_id: request.receiver_id.as_ref().map_or(NotSet, |receiver_id| Set(Some(receiver_id.clone()))),
        receiver_type: request.receiver_type.as_ref().map_or(NotSet, |receiver_type| Set(Some(receiver_type.clone()))),
        content_type: Set(request.content_type.clone()),
        content: Set(request.content.clone()),
        read_status: Set(request.read_status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionServingMessageRequest, existing: MallPromotionServingMessage) -> MallPromotionServingMessageActiveModel {
    let mut active_model: MallPromotionServingMessageActiveModel = existing.into();
    if let Some(conversation_id) = &request.conversation_id { 
        active_model.conversation_id = Set(conversation_id.clone());
    }
    if let Some(sender_id) = &request.sender_id { 
        active_model.sender_id = Set(sender_id.clone());
    }
    if let Some(sender_type) = &request.sender_type { 
        active_model.sender_type = Set(sender_type.clone());
    }
    if let Some(receiver_id) = &request.receiver_id { 
        active_model.receiver_id = Set(Some(receiver_id.clone()));
    }
    if let Some(receiver_type) = &request.receiver_type { 
        active_model.receiver_type = Set(Some(receiver_type.clone()));
    }
    if let Some(content_type) = &request.content_type { 
        active_model.content_type = Set(content_type.clone());
    }
    if let Some(content) = &request.content { 
        active_model.content = Set(content.clone());
    }
    if let Some(read_status) = &request.read_status { 
        active_model.read_status = Set(read_status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionServingMessage) -> MallPromotionServingMessageResponse {
    MallPromotionServingMessageResponse { 
        id: model.id,
        conversation_id: model.conversation_id,
        sender_id: model.sender_id,
        sender_type: model.sender_type,
        receiver_id: model.receiver_id,
        receiver_type: model.receiver_type,
        content_type: model.content_type,
        content: model.content,
        read_status: model.read_status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}