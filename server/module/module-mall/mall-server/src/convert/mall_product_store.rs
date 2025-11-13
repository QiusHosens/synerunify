use sea_orm::{Set, NotSet};
use crate::model::mall_product_store::{self, Model as MallProductStore, ActiveModel as MallProductStoreActiveModel};
use mall_model::request::mall_product_store::{CreateMallProductStoreRequest, UpdateMallProductStoreRequest};
use mall_model::response::mall_product_store::MallProductStoreResponse;

pub fn create_request_to_model(request: &CreateMallProductStoreRequest) -> MallProductStoreActiveModel {
    MallProductStoreActiveModel {
        product_id: Set(request.product_id.clone()),
        store_id: Set(request.store_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductStoreRequest, existing: MallProductStore) -> MallProductStoreActiveModel {
    let mut active_model: MallProductStoreActiveModel = existing.into();
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let Some(store_id) = &request.store_id { 
        active_model.store_id = Set(store_id.clone());
    }
    active_model
}

pub fn model_to_response(model: MallProductStore) -> MallProductStoreResponse {
    MallProductStoreResponse { 
        id: model.id,
        product_id: model.product_id,
        store_id: model.store_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}