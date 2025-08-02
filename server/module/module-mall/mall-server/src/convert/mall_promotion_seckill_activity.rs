use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_seckill_activity::{self, Model as MallPromotionSeckillActivity, ActiveModel as MallPromotionSeckillActivityActiveModel};
use mall_model::request::mall_promotion_seckill_activity::{CreateMallPromotionSeckillActivityRequest, UpdateMallPromotionSeckillActivityRequest};
use mall_model::response::mall_promotion_seckill_activity::MallPromotionSeckillActivityResponse;

pub fn create_request_to_model(request: &CreateMallPromotionSeckillActivityRequest) -> MallPromotionSeckillActivityActiveModel {
    MallPromotionSeckillActivityActiveModel {
        spu_id: Set(request.spu_id.clone()),
        name: Set(request.name.clone()),
        status: Set(request.status.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        start_time: Set(request.start_time.clone()),
        end_time: Set(request.end_time.clone()),
        sort: Set(request.sort.clone()),
        config_ids: Set(request.config_ids.clone()),
        total_limit_count: request.total_limit_count.as_ref().map_or(NotSet, |total_limit_count| Set(Some(total_limit_count.clone()))),
        single_limit_count: request.single_limit_count.as_ref().map_or(NotSet, |single_limit_count| Set(Some(single_limit_count.clone()))),
        stock: request.stock.as_ref().map_or(NotSet, |stock| Set(Some(stock.clone()))),
        total_stock: request.total_stock.as_ref().map_or(NotSet, |total_stock| Set(Some(total_stock.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionSeckillActivityRequest, existing: MallPromotionSeckillActivity) -> MallPromotionSeckillActivityActiveModel {
    let mut active_model: MallPromotionSeckillActivityActiveModel = existing.into();
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    if let Some(start_time) = &request.start_time { 
        active_model.start_time = Set(start_time.clone());
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(end_time.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(config_ids) = &request.config_ids { 
        active_model.config_ids = Set(config_ids.clone());
    }
    if let Some(total_limit_count) = &request.total_limit_count { 
        active_model.total_limit_count = Set(Some(total_limit_count.clone()));
    }
    if let Some(single_limit_count) = &request.single_limit_count { 
        active_model.single_limit_count = Set(Some(single_limit_count.clone()));
    }
    if let Some(stock) = &request.stock { 
        active_model.stock = Set(Some(stock.clone()));
    }
    if let Some(total_stock) = &request.total_stock { 
        active_model.total_stock = Set(Some(total_stock.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallPromotionSeckillActivity) -> MallPromotionSeckillActivityResponse {
    MallPromotionSeckillActivityResponse { 
        id: model.id,
        spu_id: model.spu_id,
        name: model.name,
        status: model.status,
        remark: model.remark,
        start_time: model.start_time,
        end_time: model.end_time,
        sort: model.sort,
        config_ids: model.config_ids,
        total_limit_count: model.total_limit_count,
        single_limit_count: model.single_limit_count,
        stock: model.stock,
        total_stock: model.total_stock,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}