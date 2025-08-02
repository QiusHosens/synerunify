use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_bargain_help::{self, Model as MallPromotionBargainHelp, ActiveModel as MallPromotionBargainHelpActiveModel};
use mall_model::request::mall_promotion_bargain_help::{CreateMallPromotionBargainHelpRequest, UpdateMallPromotionBargainHelpRequest};
use mall_model::response::mall_promotion_bargain_help::MallPromotionBargainHelpResponse;

pub fn create_request_to_model(request: &CreateMallPromotionBargainHelpRequest) -> MallPromotionBargainHelpActiveModel {
    MallPromotionBargainHelpActiveModel {
        user_id: Set(request.user_id.clone()),
        activity_id: Set(request.activity_id.clone()),
        record_id: Set(request.record_id.clone()),
        reduce_price: Set(request.reduce_price.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionBargainHelpRequest, existing: MallPromotionBargainHelp) -> MallPromotionBargainHelpActiveModel {
    let mut active_model: MallPromotionBargainHelpActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(activity_id) = &request.activity_id { 
        active_model.activity_id = Set(activity_id.clone());
    }
    if let Some(record_id) = &request.record_id { 
        active_model.record_id = Set(record_id.clone());
    }
    if let Some(reduce_price) = &request.reduce_price { 
        active_model.reduce_price = Set(reduce_price.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionBargainHelp) -> MallPromotionBargainHelpResponse {
    MallPromotionBargainHelpResponse { 
        id: model.id,
        user_id: model.user_id,
        activity_id: model.activity_id,
        record_id: model.record_id,
        reduce_price: model.reduce_price,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}