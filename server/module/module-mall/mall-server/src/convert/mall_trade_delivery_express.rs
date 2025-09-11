use sea_orm::{Set, NotSet};
use crate::model::mall_trade_delivery_express::{self, Model as MallTradeDeliveryExpress, ActiveModel as MallTradeDeliveryExpressActiveModel};
use mall_model::request::mall_trade_delivery_express::{CreateMallTradeDeliveryExpressRequest, UpdateMallTradeDeliveryExpressRequest};
use mall_model::response::mall_trade_delivery_express::MallTradeDeliveryExpressResponse;

pub fn create_request_to_model(request: &CreateMallTradeDeliveryExpressRequest) -> MallTradeDeliveryExpressActiveModel {
    MallTradeDeliveryExpressActiveModel {
        code: Set(request.code.clone()),
        name: Set(request.name.clone()),
        file_id: request.file_id.as_ref().map_or(NotSet, |file_id| Set(Some(file_id.clone()))),
        sort: Set(request.sort.clone()),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeDeliveryExpressRequest, existing: MallTradeDeliveryExpress) -> MallTradeDeliveryExpressActiveModel {
    let mut active_model: MallTradeDeliveryExpressActiveModel = existing.into();
    if let Some(code) = &request.code { 
        active_model.code = Set(code.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(logo) = &request.file_id {
        active_model.file_id = Set(Some(logo.clone()));
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeDeliveryExpress) -> MallTradeDeliveryExpressResponse {
    MallTradeDeliveryExpressResponse { 
        id: model.id,
        code: model.code,
        name: model.name,
        file_id: model.file_id,
        sort: model.sort,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}