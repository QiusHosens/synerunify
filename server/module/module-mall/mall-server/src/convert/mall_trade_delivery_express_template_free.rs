use sea_orm::{Set, NotSet};
use crate::model::mall_trade_delivery_express_template_free::{self, Model as MallTradeDeliveryExpressTemplateFree, ActiveModel as MallTradeDeliveryExpressTemplateFreeActiveModel};
use mall_model::request::mall_trade_delivery_express_template_free::{CreateMallTradeDeliveryExpressTemplateFreeRequest, UpdateMallTradeDeliveryExpressTemplateFreeRequest};
use mall_model::response::mall_trade_delivery_express_template_free::{MallTradeDeliveryExpressTemplateFreeBaseResponse, MallTradeDeliveryExpressTemplateFreeResponse};

pub fn create_request_to_model(request: &CreateMallTradeDeliveryExpressTemplateFreeRequest) -> MallTradeDeliveryExpressTemplateFreeActiveModel {
    MallTradeDeliveryExpressTemplateFreeActiveModel {
        area_ids: Set(request.area_ids.clone()),
        free_price: Set(request.free_price.clone()),
        free_count: Set(request.free_count.clone()),
        ..Default::default()
    }
}

pub fn update_add_request_to_model(request: &UpdateMallTradeDeliveryExpressTemplateFreeRequest) -> MallTradeDeliveryExpressTemplateFreeActiveModel {
    MallTradeDeliveryExpressTemplateFreeActiveModel {
        area_ids: Set(request.area_ids.clone()),
        free_price: Set(request.free_price.clone()),
        free_count: Set(request.free_count.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeDeliveryExpressTemplateFreeRequest, existing: MallTradeDeliveryExpressTemplateFree) -> MallTradeDeliveryExpressTemplateFreeActiveModel {
    let mut active_model: MallTradeDeliveryExpressTemplateFreeActiveModel = existing.into();
    if let area_ids = &request.area_ids {
        active_model.area_ids = Set(area_ids.clone());
    }
    if let free_price = &request.free_price {
        active_model.free_price = Set(free_price.clone());
    }
    if let free_count = &request.free_count {
        active_model.free_count = Set(free_count.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeDeliveryExpressTemplateFree) -> MallTradeDeliveryExpressTemplateFreeResponse {
    MallTradeDeliveryExpressTemplateFreeResponse { 
        id: model.id,
        template_id: model.template_id,
        area_ids: model.area_ids,
        free_price: model.free_price,
        free_count: model.free_count,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_base_response(model: MallTradeDeliveryExpressTemplateFree) -> MallTradeDeliveryExpressTemplateFreeBaseResponse {
    MallTradeDeliveryExpressTemplateFreeBaseResponse {
        id: model.id,
        template_id: model.template_id,
        area_ids: model.area_ids,
        free_price: model.free_price,
        free_count: model.free_count,
    }
}