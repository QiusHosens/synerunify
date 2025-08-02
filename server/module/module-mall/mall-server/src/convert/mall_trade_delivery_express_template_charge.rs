use sea_orm::{Set, NotSet};
use crate::model::mall_trade_delivery_express_template_charge::{self, Model as MallTradeDeliveryExpressTemplateCharge, ActiveModel as MallTradeDeliveryExpressTemplateChargeActiveModel};
use mall_model::request::mall_trade_delivery_express_template_charge::{CreateMallTradeDeliveryExpressTemplateChargeRequest, UpdateMallTradeDeliveryExpressTemplateChargeRequest};
use mall_model::response::mall_trade_delivery_express_template_charge::MallTradeDeliveryExpressTemplateChargeResponse;

pub fn create_request_to_model(request: &CreateMallTradeDeliveryExpressTemplateChargeRequest) -> MallTradeDeliveryExpressTemplateChargeActiveModel {
    MallTradeDeliveryExpressTemplateChargeActiveModel {
        template_id: Set(request.template_id.clone()),
        area_ids: Set(request.area_ids.clone()),
        charge_mode: Set(request.charge_mode.clone()),
        start_count: Set(request.start_count.clone()),
        start_price: Set(request.start_price.clone()),
        extra_count: Set(request.extra_count.clone()),
        extra_price: Set(request.extra_price.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeDeliveryExpressTemplateChargeRequest, existing: MallTradeDeliveryExpressTemplateCharge) -> MallTradeDeliveryExpressTemplateChargeActiveModel {
    let mut active_model: MallTradeDeliveryExpressTemplateChargeActiveModel = existing.into();
    if let Some(template_id) = &request.template_id { 
        active_model.template_id = Set(template_id.clone());
    }
    if let Some(area_ids) = &request.area_ids { 
        active_model.area_ids = Set(area_ids.clone());
    }
    if let Some(charge_mode) = &request.charge_mode { 
        active_model.charge_mode = Set(charge_mode.clone());
    }
    if let Some(start_count) = &request.start_count { 
        active_model.start_count = Set(start_count.clone());
    }
    if let Some(start_price) = &request.start_price { 
        active_model.start_price = Set(start_price.clone());
    }
    if let Some(extra_count) = &request.extra_count { 
        active_model.extra_count = Set(extra_count.clone());
    }
    if let Some(extra_price) = &request.extra_price { 
        active_model.extra_price = Set(extra_price.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeDeliveryExpressTemplateCharge) -> MallTradeDeliveryExpressTemplateChargeResponse {
    MallTradeDeliveryExpressTemplateChargeResponse { 
        id: model.id,
        template_id: model.template_id,
        area_ids: model.area_ids,
        charge_mode: model.charge_mode,
        start_count: model.start_count,
        start_price: model.start_price,
        extra_count: model.extra_count,
        extra_price: model.extra_price,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}