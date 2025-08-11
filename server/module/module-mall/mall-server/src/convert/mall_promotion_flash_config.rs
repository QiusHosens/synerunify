use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_flash_config::{self, Model as MallPromotionFlashConfig, ActiveModel as MallPromotionFlashConfigActiveModel};
use mall_model::request::mall_promotion_flash_config::{CreateMallPromotionFlashConfigRequest, UpdateMallPromotionFlashConfigRequest};
use mall_model::response::mall_promotion_flash_config::MallPromotionFlashConfigResponse;

pub fn create_request_to_model(request: &CreateMallPromotionFlashConfigRequest) -> MallPromotionFlashConfigActiveModel {
    MallPromotionFlashConfigActiveModel {
        name: Set(request.name.clone()),
        start_time: Set(request.start_time.clone()),
        end_time: Set(request.end_time.clone()),
        slider_file_ids: Set(request.slider_file_ids.clone()),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionFlashConfigRequest, existing: MallPromotionFlashConfig) -> MallPromotionFlashConfigActiveModel {
    let mut active_model: MallPromotionFlashConfigActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(start_time) = &request.start_time { 
        active_model.start_time = Set(start_time.clone());
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(end_time.clone());
    }
    if let Some(slider_file_ids) = &request.slider_file_ids { 
        active_model.slider_file_ids = Set(slider_file_ids.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionFlashConfig) -> MallPromotionFlashConfigResponse {
    MallPromotionFlashConfigResponse { 
        id: model.id,
        name: model.name,
        start_time: model.start_time,
        end_time: model.end_time,
        slider_file_ids: model.slider_file_ids,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}