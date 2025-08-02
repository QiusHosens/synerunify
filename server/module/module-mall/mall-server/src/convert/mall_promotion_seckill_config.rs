use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_seckill_config::{self, Model as MallPromotionSeckillConfig, ActiveModel as MallPromotionSeckillConfigActiveModel};
use mall_model::request::mall_promotion_seckill_config::{CreateMallPromotionSeckillConfigRequest, UpdateMallPromotionSeckillConfigRequest};
use mall_model::response::mall_promotion_seckill_config::MallPromotionSeckillConfigResponse;

pub fn create_request_to_model(request: &CreateMallPromotionSeckillConfigRequest) -> MallPromotionSeckillConfigActiveModel {
    MallPromotionSeckillConfigActiveModel {
        name: Set(request.name.clone()),
        start_time: Set(request.start_time.clone()),
        end_time: Set(request.end_time.clone()),
        slider_pic_urls: Set(request.slider_pic_urls.clone()),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionSeckillConfigRequest, existing: MallPromotionSeckillConfig) -> MallPromotionSeckillConfigActiveModel {
    let mut active_model: MallPromotionSeckillConfigActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(start_time) = &request.start_time { 
        active_model.start_time = Set(start_time.clone());
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(end_time.clone());
    }
    if let Some(slider_pic_urls) = &request.slider_pic_urls { 
        active_model.slider_pic_urls = Set(slider_pic_urls.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionSeckillConfig) -> MallPromotionSeckillConfigResponse {
    MallPromotionSeckillConfigResponse { 
        id: model.id,
        name: model.name,
        start_time: model.start_time,
        end_time: model.end_time,
        slider_pic_urls: model.slider_pic_urls,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}