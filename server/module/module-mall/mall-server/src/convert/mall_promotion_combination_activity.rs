use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_combination_activity::{self, Model as MallPromotionCombinationActivity, ActiveModel as MallPromotionCombinationActivityActiveModel};
use mall_model::request::mall_promotion_combination_activity::{CreateMallPromotionCombinationActivityRequest, UpdateMallPromotionCombinationActivityRequest};
use mall_model::response::mall_promotion_combination_activity::MallPromotionCombinationActivityResponse;

pub fn create_request_to_model(request: &CreateMallPromotionCombinationActivityRequest) -> MallPromotionCombinationActivityActiveModel {
    MallPromotionCombinationActivityActiveModel {
        name: Set(request.name.clone()),
        spu_id: Set(request.spu_id.clone()),
        total_limit_count: Set(request.total_limit_count.clone()),
        single_limit_count: Set(request.single_limit_count.clone()),
        start_time: Set(request.start_time.clone()),
        end_time: Set(request.end_time.clone()),
        user_size: request.user_size.as_ref().map_or(NotSet, |user_size| Set(Some(user_size.clone()))),
        virtual_group: Set(request.virtual_group.clone()),
        status: Set(request.status.clone()),
        limit_duration: Set(request.limit_duration.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionCombinationActivityRequest, existing: MallPromotionCombinationActivity) -> MallPromotionCombinationActivityActiveModel {
    let mut active_model: MallPromotionCombinationActivityActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(total_limit_count) = &request.total_limit_count { 
        active_model.total_limit_count = Set(total_limit_count.clone());
    }
    if let Some(single_limit_count) = &request.single_limit_count { 
        active_model.single_limit_count = Set(single_limit_count.clone());
    }
    if let Some(start_time) = &request.start_time { 
        active_model.start_time = Set(start_time.clone());
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(end_time.clone());
    }
    if let Some(user_size) = &request.user_size { 
        active_model.user_size = Set(Some(user_size.clone()));
    }
    if let Some(virtual_group) = &request.virtual_group { 
        active_model.virtual_group = Set(virtual_group.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(limit_duration) = &request.limit_duration { 
        active_model.limit_duration = Set(limit_duration.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionCombinationActivity) -> MallPromotionCombinationActivityResponse {
    MallPromotionCombinationActivityResponse { 
        id: model.id,
        name: model.name,
        spu_id: model.spu_id,
        total_limit_count: model.total_limit_count,
        single_limit_count: model.single_limit_count,
        start_time: model.start_time,
        end_time: model.end_time,
        user_size: model.user_size,
        virtual_group: model.virtual_group,
        status: model.status,
        limit_duration: model.limit_duration,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}