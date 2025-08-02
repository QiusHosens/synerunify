use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_bargain_activity::{self, Model as MallPromotionBargainActivity, ActiveModel as MallPromotionBargainActivityActiveModel};
use mall_model::request::mall_promotion_bargain_activity::{CreateMallPromotionBargainActivityRequest, UpdateMallPromotionBargainActivityRequest};
use mall_model::response::mall_promotion_bargain_activity::MallPromotionBargainActivityResponse;

pub fn create_request_to_model(request: &CreateMallPromotionBargainActivityRequest) -> MallPromotionBargainActivityActiveModel {
    MallPromotionBargainActivityActiveModel {
        name: Set(request.name.clone()),
        start_time: Set(request.start_time.clone()),
        end_time: Set(request.end_time.clone()),
        status: Set(request.status.clone()),
        spu_id: Set(request.spu_id.clone()),
        sku_id: Set(request.sku_id.clone()),
        bargain_first_price: Set(request.bargain_first_price.clone()),
        bargain_min_price: Set(request.bargain_min_price.clone()),
        stock: Set(request.stock.clone()),
        total_stock: Set(request.total_stock.clone()),
        help_max_count: Set(request.help_max_count.clone()),
        bargain_count: Set(request.bargain_count.clone()),
        total_limit_count: Set(request.total_limit_count.clone()),
        random_min_price: Set(request.random_min_price.clone()),
        random_max_price: Set(request.random_max_price.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionBargainActivityRequest, existing: MallPromotionBargainActivity) -> MallPromotionBargainActivityActiveModel {
    let mut active_model: MallPromotionBargainActivityActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(start_time) = &request.start_time { 
        active_model.start_time = Set(start_time.clone());
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(end_time.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
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
    if let Some(bargain_min_price) = &request.bargain_min_price { 
        active_model.bargain_min_price = Set(bargain_min_price.clone());
    }
    if let Some(stock) = &request.stock { 
        active_model.stock = Set(stock.clone());
    }
    if let Some(total_stock) = &request.total_stock { 
        active_model.total_stock = Set(total_stock.clone());
    }
    if let Some(help_max_count) = &request.help_max_count { 
        active_model.help_max_count = Set(help_max_count.clone());
    }
    if let Some(bargain_count) = &request.bargain_count { 
        active_model.bargain_count = Set(bargain_count.clone());
    }
    if let Some(total_limit_count) = &request.total_limit_count { 
        active_model.total_limit_count = Set(total_limit_count.clone());
    }
    if let Some(random_min_price) = &request.random_min_price { 
        active_model.random_min_price = Set(random_min_price.clone());
    }
    if let Some(random_max_price) = &request.random_max_price { 
        active_model.random_max_price = Set(random_max_price.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionBargainActivity) -> MallPromotionBargainActivityResponse {
    MallPromotionBargainActivityResponse { 
        id: model.id,
        name: model.name,
        start_time: model.start_time,
        end_time: model.end_time,
        status: model.status,
        spu_id: model.spu_id,
        sku_id: model.sku_id,
        bargain_first_price: model.bargain_first_price,
        bargain_min_price: model.bargain_min_price,
        stock: model.stock,
        total_stock: model.total_stock,
        help_max_count: model.help_max_count,
        bargain_count: model.bargain_count,
        total_limit_count: model.total_limit_count,
        random_min_price: model.random_min_price,
        random_max_price: model.random_max_price,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}