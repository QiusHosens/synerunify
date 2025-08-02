use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_point_activity::{self, Model as MallPromotionPointActivity, ActiveModel as MallPromotionPointActivityActiveModel};
use mall_model::request::mall_promotion_point_activity::{CreateMallPromotionPointActivityRequest, UpdateMallPromotionPointActivityRequest};
use mall_model::response::mall_promotion_point_activity::MallPromotionPointActivityResponse;

pub fn create_request_to_model(request: &CreateMallPromotionPointActivityRequest) -> MallPromotionPointActivityActiveModel {
    MallPromotionPointActivityActiveModel {
        spu_id: Set(request.spu_id.clone()),
        status: Set(request.status.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        sort: Set(request.sort.clone()),
        stock: Set(request.stock.clone()),
        total_stock: Set(request.total_stock.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionPointActivityRequest, existing: MallPromotionPointActivity) -> MallPromotionPointActivityActiveModel {
    let mut active_model: MallPromotionPointActivityActiveModel = existing.into();
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(stock) = &request.stock { 
        active_model.stock = Set(stock.clone());
    }
    if let Some(total_stock) = &request.total_stock { 
        active_model.total_stock = Set(total_stock.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionPointActivity) -> MallPromotionPointActivityResponse {
    MallPromotionPointActivityResponse { 
        id: model.id,
        spu_id: model.spu_id,
        status: model.status,
        remark: model.remark,
        sort: model.sort,
        stock: model.stock,
        total_stock: model.total_stock,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}