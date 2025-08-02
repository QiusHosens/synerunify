use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_discount_activity::{self, Model as MallPromotionDiscountActivity, ActiveModel as MallPromotionDiscountActivityActiveModel};
use mall_model::request::mall_promotion_discount_activity::{CreateMallPromotionDiscountActivityRequest, UpdateMallPromotionDiscountActivityRequest};
use mall_model::response::mall_promotion_discount_activity::MallPromotionDiscountActivityResponse;

pub fn create_request_to_model(request: &CreateMallPromotionDiscountActivityRequest) -> MallPromotionDiscountActivityActiveModel {
    MallPromotionDiscountActivityActiveModel {
        name: Set(request.name.clone()),
        status: Set(request.status.clone()),
        start_time: Set(request.start_time.clone()),
        end_time: Set(request.end_time.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionDiscountActivityRequest, existing: MallPromotionDiscountActivity) -> MallPromotionDiscountActivityActiveModel {
    let mut active_model: MallPromotionDiscountActivityActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(start_time) = &request.start_time { 
        active_model.start_time = Set(start_time.clone());
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(end_time.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallPromotionDiscountActivity) -> MallPromotionDiscountActivityResponse {
    MallPromotionDiscountActivityResponse { 
        id: model.id,
        name: model.name,
        status: model.status,
        start_time: model.start_time,
        end_time: model.end_time,
        remark: model.remark,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}