use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_bargain_record::{self, Model as MallPromotionBargainRecord, ActiveModel as MallPromotionBargainRecordActiveModel};
use mall_model::request::mall_promotion_bargain_record::{CreateMallPromotionBargainRecordRequest, UpdateMallPromotionBargainRecordRequest};
use mall_model::response::mall_promotion_bargain_record::MallPromotionBargainRecordResponse;

pub fn create_request_to_model(request: &CreateMallPromotionBargainRecordRequest) -> MallPromotionBargainRecordActiveModel {
    MallPromotionBargainRecordActiveModel {
        activity_id: Set(request.activity_id.clone()),
        user_id: Set(request.user_id.clone()),
        spu_id: Set(request.spu_id.clone()),
        sku_id: Set(request.sku_id.clone()),
        bargain_first_price: Set(request.bargain_first_price.clone()),
        bargain_price: Set(request.bargain_price.clone()),
        status: Set(request.status.clone()),
        order_id: request.order_id.as_ref().map_or(NotSet, |order_id| Set(Some(order_id.clone()))),
        end_time: Set(request.end_time.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionBargainRecordRequest, existing: MallPromotionBargainRecord) -> MallPromotionBargainRecordActiveModel {
    let mut active_model: MallPromotionBargainRecordActiveModel = existing.into();
    if let Some(activity_id) = &request.activity_id { 
        active_model.activity_id = Set(activity_id.clone());
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(sku_id.clone());
    }
    if let Some(bargain_first_price) = &request.bargain_first_price { 
        active_model.bargain_first_price = Set(bargain_first_price.clone());
    }
    if let Some(bargain_price) = &request.bargain_price { 
        active_model.bargain_price = Set(bargain_price.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(Some(order_id.clone()));
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(end_time.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionBargainRecord) -> MallPromotionBargainRecordResponse {
    MallPromotionBargainRecordResponse { 
        id: model.id,
        activity_id: model.activity_id,
        user_id: model.user_id,
        spu_id: model.spu_id,
        sku_id: model.sku_id,
        bargain_first_price: model.bargain_first_price,
        bargain_price: model.bargain_price,
        status: model.status,
        order_id: model.order_id,
        end_time: model.end_time,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}