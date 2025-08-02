use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_discount_product::{self, Model as MallPromotionDiscountProduct, ActiveModel as MallPromotionDiscountProductActiveModel};
use mall_model::request::mall_promotion_discount_product::{CreateMallPromotionDiscountProductRequest, UpdateMallPromotionDiscountProductRequest};
use mall_model::response::mall_promotion_discount_product::MallPromotionDiscountProductResponse;

pub fn create_request_to_model(request: &CreateMallPromotionDiscountProductRequest) -> MallPromotionDiscountProductActiveModel {
    MallPromotionDiscountProductActiveModel {
        activity_id: Set(request.activity_id.clone()),
        spu_id: Set(request.spu_id.clone()),
        sku_id: Set(request.sku_id.clone()),
        discount_type: Set(request.discount_type.clone()),
        discount_percent: request.discount_percent.as_ref().map_or(NotSet, |discount_percent| Set(Some(discount_percent.clone()))),
        discount_price: request.discount_price.as_ref().map_or(NotSet, |discount_price| Set(Some(discount_price.clone()))),
        activity_status: Set(request.activity_status.clone()),
        activity_name: Set(request.activity_name.clone()),
        activity_start_time: Set(request.activity_start_time.clone()),
        activity_end_time: Set(request.activity_end_time.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionDiscountProductRequest, existing: MallPromotionDiscountProduct) -> MallPromotionDiscountProductActiveModel {
    let mut active_model: MallPromotionDiscountProductActiveModel = existing.into();
    if let Some(activity_id) = &request.activity_id { 
        active_model.activity_id = Set(activity_id.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(sku_id.clone());
    }
    if let Some(discount_type) = &request.discount_type { 
        active_model.discount_type = Set(discount_type.clone());
    }
    if let Some(discount_percent) = &request.discount_percent { 
        active_model.discount_percent = Set(Some(discount_percent.clone()));
    }
    if let Some(discount_price) = &request.discount_price { 
        active_model.discount_price = Set(Some(discount_price.clone()));
    }
    if let Some(activity_status) = &request.activity_status { 
        active_model.activity_status = Set(activity_status.clone());
    }
    if let Some(activity_name) = &request.activity_name { 
        active_model.activity_name = Set(activity_name.clone());
    }
    if let Some(activity_start_time) = &request.activity_start_time { 
        active_model.activity_start_time = Set(activity_start_time.clone());
    }
    if let Some(activity_end_time) = &request.activity_end_time { 
        active_model.activity_end_time = Set(activity_end_time.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionDiscountProduct) -> MallPromotionDiscountProductResponse {
    MallPromotionDiscountProductResponse { 
        id: model.id,
        activity_id: model.activity_id,
        spu_id: model.spu_id,
        sku_id: model.sku_id,
        discount_type: model.discount_type,
        discount_percent: model.discount_percent,
        discount_price: model.discount_price,
        activity_status: model.activity_status,
        activity_name: model.activity_name,
        activity_start_time: model.activity_start_time,
        activity_end_time: model.activity_end_time,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}