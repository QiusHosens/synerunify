use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_seckill_product::{self, Model as MallPromotionSeckillProduct, ActiveModel as MallPromotionSeckillProductActiveModel};
use mall_model::request::mall_promotion_seckill_product::{CreateMallPromotionSeckillProductRequest, UpdateMallPromotionSeckillProductRequest};
use mall_model::response::mall_promotion_seckill_product::MallPromotionSeckillProductResponse;

pub fn create_request_to_model(request: &CreateMallPromotionSeckillProductRequest) -> MallPromotionSeckillProductActiveModel {
    MallPromotionSeckillProductActiveModel {
        activity_id: Set(request.activity_id.clone()),
        config_ids: Set(request.config_ids.clone()),
        spu_id: Set(request.spu_id.clone()),
        sku_id: Set(request.sku_id.clone()),
        seckill_price: Set(request.seckill_price.clone()),
        stock: Set(request.stock.clone()),
        activity_status: Set(request.activity_status.clone()),
        activity_start_time: Set(request.activity_start_time.clone()),
        activity_end_time: Set(request.activity_end_time.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionSeckillProductRequest, existing: MallPromotionSeckillProduct) -> MallPromotionSeckillProductActiveModel {
    let mut active_model: MallPromotionSeckillProductActiveModel = existing.into();
    if let Some(activity_id) = &request.activity_id { 
        active_model.activity_id = Set(activity_id.clone());
    }
    if let Some(config_ids) = &request.config_ids { 
        active_model.config_ids = Set(config_ids.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(sku_id.clone());
    }
    if let Some(seckill_price) = &request.seckill_price { 
        active_model.seckill_price = Set(seckill_price.clone());
    }
    if let Some(stock) = &request.stock { 
        active_model.stock = Set(stock.clone());
    }
    if let Some(activity_status) = &request.activity_status { 
        active_model.activity_status = Set(activity_status.clone());
    }
    if let Some(activity_start_time) = &request.activity_start_time { 
        active_model.activity_start_time = Set(activity_start_time.clone());
    }
    if let Some(activity_end_time) = &request.activity_end_time { 
        active_model.activity_end_time = Set(activity_end_time.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionSeckillProduct) -> MallPromotionSeckillProductResponse {
    MallPromotionSeckillProductResponse { 
        id: model.id,
        activity_id: model.activity_id,
        config_ids: model.config_ids,
        spu_id: model.spu_id,
        sku_id: model.sku_id,
        seckill_price: model.seckill_price,
        stock: model.stock,
        activity_status: model.activity_status,
        activity_start_time: model.activity_start_time,
        activity_end_time: model.activity_end_time,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}