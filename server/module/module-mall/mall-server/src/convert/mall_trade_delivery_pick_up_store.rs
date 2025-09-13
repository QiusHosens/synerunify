use sea_orm::{Set, NotSet};
use crate::model::mall_trade_delivery_pick_up_store::{self, Model as MallTradeDeliveryPickUpStore, ActiveModel as MallTradeDeliveryPickUpStoreActiveModel};
use mall_model::request::mall_trade_delivery_pick_up_store::{CreateMallTradeDeliveryPickUpStoreRequest, UpdateMallTradeDeliveryPickUpStoreRequest};
use mall_model::response::mall_trade_delivery_pick_up_store::MallTradeDeliveryPickUpStoreResponse;

pub fn create_request_to_model(request: &CreateMallTradeDeliveryPickUpStoreRequest) -> MallTradeDeliveryPickUpStoreActiveModel {
    MallTradeDeliveryPickUpStoreActiveModel {
        name: Set(request.name.clone()),
        introduction: request.introduction.as_ref().map_or(NotSet, |introduction| Set(Some(introduction.clone()))),
        phone: Set(request.phone.clone()),
        area_id: Set(request.area_id.clone()),
        detail_address: Set(request.detail_address.clone()),
        file_id: Set(request.file_id.clone()),
        opening_time: Set(request.opening_time.clone()),
        closing_time: Set(request.closing_time.clone()),
        latitude: Set(request.latitude.clone()),
        longitude: Set(request.longitude.clone()),
        verify_user_ids: request.verify_user_ids.as_ref().map_or(NotSet, |verify_user_ids| Set(Some(verify_user_ids.clone()))),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeDeliveryPickUpStoreRequest, existing: MallTradeDeliveryPickUpStore) -> MallTradeDeliveryPickUpStoreActiveModel {
    let mut active_model: MallTradeDeliveryPickUpStoreActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(introduction) = &request.introduction { 
        active_model.introduction = Set(Some(introduction.clone()));
    }
    if let Some(phone) = &request.phone { 
        active_model.phone = Set(phone.clone());
    }
    if let Some(area_id) = &request.area_id { 
        active_model.area_id = Set(area_id.clone());
    }
    if let Some(detail_address) = &request.detail_address { 
        active_model.detail_address = Set(detail_address.clone());
    }
    if let Some(file_id) = &request.file_id {
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(opening_time) = &request.opening_time { 
        active_model.opening_time = Set(opening_time.clone());
    }
    if let Some(closing_time) = &request.closing_time { 
        active_model.closing_time = Set(closing_time.clone());
    }
    if let Some(latitude) = &request.latitude { 
        active_model.latitude = Set(latitude.clone());
    }
    if let Some(longitude) = &request.longitude { 
        active_model.longitude = Set(longitude.clone());
    }
    if let Some(verify_user_ids) = &request.verify_user_ids { 
        active_model.verify_user_ids = Set(Some(verify_user_ids.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeDeliveryPickUpStore) -> MallTradeDeliveryPickUpStoreResponse {
    MallTradeDeliveryPickUpStoreResponse { 
        id: model.id,
        name: model.name,
        introduction: model.introduction,
        phone: model.phone,
        area_id: model.area_id,
        detail_address: model.detail_address,
        file_id: model.file_id,
        opening_time: model.opening_time,
        closing_time: model.closing_time,
        latitude: model.latitude,
        longitude: model.longitude,
        verify_user_ids: model.verify_user_ids,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}