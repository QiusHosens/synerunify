use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_reward_activity::{self, Model as MallPromotionRewardActivity, ActiveModel as MallPromotionRewardActivityActiveModel};
use mall_model::request::mall_promotion_reward_activity::{CreateMallPromotionRewardActivityRequest, UpdateMallPromotionRewardActivityRequest};
use mall_model::response::mall_promotion_reward_activity::MallPromotionRewardActivityResponse;

pub fn create_request_to_model(request: &CreateMallPromotionRewardActivityRequest) -> MallPromotionRewardActivityActiveModel {
    MallPromotionRewardActivityActiveModel {
        name: Set(request.name.clone()),
        status: Set(request.status.clone()),
        start_time: Set(request.start_time.clone()),
        end_time: Set(request.end_time.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        condition_type: Set(request.condition_type.clone()),
        product_scope: Set(request.product_scope.clone()),
        product_scope_values: request.product_scope_values.as_ref().map_or(NotSet, |product_scope_values| Set(Some(product_scope_values.clone()))),
        rules: request.rules.as_ref().map_or(NotSet, |rules| Set(Some(rules.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionRewardActivityRequest, existing: MallPromotionRewardActivity) -> MallPromotionRewardActivityActiveModel {
    let mut active_model: MallPromotionRewardActivityActiveModel = existing.into();
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
    if let Some(condition_type) = &request.condition_type { 
        active_model.condition_type = Set(condition_type.clone());
    }
    if let Some(product_scope) = &request.product_scope { 
        active_model.product_scope = Set(product_scope.clone());
    }
    if let Some(product_scope_values) = &request.product_scope_values { 
        active_model.product_scope_values = Set(Some(product_scope_values.clone()));
    }
    if let Some(rules) = &request.rules { 
        active_model.rules = Set(Some(rules.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallPromotionRewardActivity) -> MallPromotionRewardActivityResponse {
    MallPromotionRewardActivityResponse { 
        id: model.id,
        name: model.name,
        status: model.status,
        start_time: model.start_time,
        end_time: model.end_time,
        remark: model.remark,
        condition_type: model.condition_type,
        product_scope: model.product_scope,
        product_scope_values: model.product_scope_values,
        rules: model.rules,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}