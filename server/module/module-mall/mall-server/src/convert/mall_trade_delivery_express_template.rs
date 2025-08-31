use sea_orm::{Set, NotSet};
use crate::model::mall_trade_delivery_express_template::{self, Model as MallTradeDeliveryExpressTemplate, ActiveModel as MallTradeDeliveryExpressTemplateActiveModel};
use mall_model::request::mall_trade_delivery_express_template::{CreateMallTradeDeliveryExpressTemplateRequest, UpdateMallTradeDeliveryExpressTemplateRequest};
use mall_model::response::mall_trade_delivery_express_template::MallTradeDeliveryExpressTemplateResponse;

pub fn create_request_to_model(request: &CreateMallTradeDeliveryExpressTemplateRequest) -> MallTradeDeliveryExpressTemplateActiveModel {
    MallTradeDeliveryExpressTemplateActiveModel {
        name: Set(request.name.clone()),
        charge_mode: Set(request.charge_mode.clone()),
        sort: Set(request.sort.clone()),
        status: Set(request.status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeDeliveryExpressTemplateRequest, existing: MallTradeDeliveryExpressTemplate) -> MallTradeDeliveryExpressTemplateActiveModel {
    let mut active_model: MallTradeDeliveryExpressTemplateActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(charge_mode) = &request.charge_mode { 
        active_model.charge_mode = Set(charge_mode.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeDeliveryExpressTemplate) -> MallTradeDeliveryExpressTemplateResponse {
    MallTradeDeliveryExpressTemplateResponse { 
        id: model.id,
        name: model.name,
        charge_mode: model.charge_mode,
        sort: model.sort,
        status: model.status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}