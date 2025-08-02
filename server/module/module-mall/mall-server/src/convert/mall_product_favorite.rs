use sea_orm::{Set, NotSet};
use crate::model::mall_product_favorite::{self, Model as MallProductFavorite, ActiveModel as MallProductFavoriteActiveModel};
use mall_model::request::mall_product_favorite::{CreateMallProductFavoriteRequest, UpdateMallProductFavoriteRequest};
use mall_model::response::mall_product_favorite::MallProductFavoriteResponse;

pub fn create_request_to_model(request: &CreateMallProductFavoriteRequest) -> MallProductFavoriteActiveModel {
    MallProductFavoriteActiveModel {
        user_id: Set(request.user_id.clone()),
        spu_id: Set(request.spu_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductFavoriteRequest, existing: MallProductFavorite) -> MallProductFavoriteActiveModel {
    let mut active_model: MallProductFavoriteActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    active_model
}

pub fn model_to_response(model: MallProductFavorite) -> MallProductFavoriteResponse {
    MallProductFavoriteResponse { 
        id: model.id,
        user_id: model.user_id,
        spu_id: model.spu_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}