use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_point_product::{self, Model as MallPromotionPointProduct, ActiveModel as MallPromotionPointProductActiveModel};
use mall_model::request::mall_promotion_point_product::{CreateMallPromotionPointProductRequest, UpdateMallPromotionPointProductRequest};
use mall_model::response::mall_promotion_point_product::MallPromotionPointProductResponse;

pub fn create_request_to_model(request: &CreateMallPromotionPointProductRequest) -> MallPromotionPointProductActiveModel {
    MallPromotionPointProductActiveModel {
        activity_id: Set(request.activity_id.clone()),
        spu_id: Set(request.spu_id.clone()),
        sku_id: Set(request.sku_id.clone()),
        count: Set(request.count.clone()),
        point: Set(request.point.clone()),
        price: Set(request.price.clone()),
        stock: Set(request.stock.clone()),
        activity_status: Set(request.activity_status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionPointProductRequest, existing: MallPromotionPointProduct) -> MallPromotionPointProductActiveModel {
    let mut active_model: MallPromotionPointProductActiveModel = existing.into();
    if let Some(activity_id) = &request.activity_id { 
        active_model.activity_id = Set(activity_id.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(sku_id.clone());
    }
    if let Some(count) = &request.count { 
        active_model.count = Set(count.clone());
    }
    if let Some(point) = &request.point { 
        active_model.point = Set(point.clone());
    }
    if let Some(price) = &request.price { 
        active_model.price = Set(price.clone());
    }
    if let Some(stock) = &request.stock { 
        active_model.stock = Set(stock.clone());
    }
    if let Some(activity_status) = &request.activity_status { 
        active_model.activity_status = Set(activity_status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionPointProduct) -> MallPromotionPointProductResponse {
    MallPromotionPointProductResponse { 
        id: model.id,
        activity_id: model.activity_id,
        spu_id: model.spu_id,
        sku_id: model.sku_id,
        count: model.count,
        point: model.point,
        price: model.price,
        stock: model.stock,
        activity_status: model.activity_status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}