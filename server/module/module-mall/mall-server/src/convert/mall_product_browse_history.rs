use sea_orm::{Set, NotSet};
use crate::model::mall_product_browse_history::{self, Model as MallProductBrowseHistory, ActiveModel as MallProductBrowseHistoryActiveModel};
use mall_model::request::mall_product_browse_history::{CreateMallProductBrowseHistoryRequest, UpdateMallProductBrowseHistoryRequest};
use mall_model::response::mall_product_browse_history::MallProductBrowseHistoryResponse;

pub fn create_request_to_model(request: &CreateMallProductBrowseHistoryRequest) -> MallProductBrowseHistoryActiveModel {
    MallProductBrowseHistoryActiveModel {
        user_id: Set(request.user_id.clone()),
        spu_id: Set(request.spu_id.clone()),
        user_deleted: Set(request.user_deleted.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductBrowseHistoryRequest, existing: MallProductBrowseHistory) -> MallProductBrowseHistoryActiveModel {
    let mut active_model: MallProductBrowseHistoryActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(user_deleted) = &request.user_deleted { 
        active_model.user_deleted = Set(user_deleted.clone());
    }
    active_model
}

pub fn model_to_response(model: MallProductBrowseHistory) -> MallProductBrowseHistoryResponse {
    MallProductBrowseHistoryResponse { 
        id: model.id,
        user_id: model.user_id,
        spu_id: model.spu_id,
        user_deleted: model.user_deleted,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}