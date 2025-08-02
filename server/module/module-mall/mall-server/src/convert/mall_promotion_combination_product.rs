use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_combination_product::{self, Model as MallPromotionCombinationProduct, ActiveModel as MallPromotionCombinationProductActiveModel};
use mall_model::request::mall_promotion_combination_product::{CreateMallPromotionCombinationProductRequest, UpdateMallPromotionCombinationProductRequest};
use mall_model::response::mall_promotion_combination_product::MallPromotionCombinationProductResponse;

pub fn create_request_to_model(request: &CreateMallPromotionCombinationProductRequest) -> MallPromotionCombinationProductActiveModel {
    MallPromotionCombinationProductActiveModel {
        activity_id: request.activity_id.as_ref().map_or(NotSet, |activity_id| Set(Some(activity_id.clone()))),
        spu_id: request.spu_id.as_ref().map_or(NotSet, |spu_id| Set(Some(spu_id.clone()))),
        sku_id: request.sku_id.as_ref().map_or(NotSet, |sku_id| Set(Some(sku_id.clone()))),
        status: Set(request.status.clone()),
        activity_start_time: Set(request.activity_start_time.clone()),
        activity_end_time: Set(request.activity_end_time.clone()),
        combination_price: Set(request.combination_price.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionCombinationProductRequest, existing: MallPromotionCombinationProduct) -> MallPromotionCombinationProductActiveModel {
    let mut active_model: MallPromotionCombinationProductActiveModel = existing.into();
    if let Some(activity_id) = &request.activity_id { 
        active_model.activity_id = Set(Some(activity_id.clone()));
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(Some(spu_id.clone()));
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(Some(sku_id.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(activity_start_time) = &request.activity_start_time { 
        active_model.activity_start_time = Set(activity_start_time.clone());
    }
    if let Some(activity_end_time) = &request.activity_end_time { 
        active_model.activity_end_time = Set(activity_end_time.clone());
    }
    if let Some(combination_price) = &request.combination_price { 
        active_model.combination_price = Set(combination_price.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionCombinationProduct) -> MallPromotionCombinationProductResponse {
    MallPromotionCombinationProductResponse { 
        id: model.id,
        activity_id: model.activity_id,
        spu_id: model.spu_id,
        sku_id: model.sku_id,
        status: model.status,
        activity_start_time: model.activity_start_time,
        activity_end_time: model.activity_end_time,
        combination_price: model.combination_price,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}