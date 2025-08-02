use sea_orm::{Set, NotSet};
use crate::model::mall_trade_config::{self, Model as MallTradeConfig, ActiveModel as MallTradeConfigActiveModel};
use mall_model::request::mall_trade_config::{CreateMallTradeConfigRequest, UpdateMallTradeConfigRequest};
use mall_model::response::mall_trade_config::MallTradeConfigResponse;

pub fn create_request_to_model(request: &CreateMallTradeConfigRequest) -> MallTradeConfigActiveModel {
    MallTradeConfigActiveModel {
        after_sale_refund_reasons: Set(request.after_sale_refund_reasons.clone()),
        after_sale_return_reasons: Set(request.after_sale_return_reasons.clone()),
        delivery_express_free_enabled: Set(request.delivery_express_free_enabled.clone()),
        delivery_express_free_price: Set(request.delivery_express_free_price.clone()),
        delivery_pick_up_enabled: Set(request.delivery_pick_up_enabled.clone()),
        brokerage_enabled: Set(request.brokerage_enabled.clone()),
        brokerage_enabled_condition: Set(request.brokerage_enabled_condition.clone()),
        brokerage_bind_mode: Set(request.brokerage_bind_mode.clone()),
        brokerage_poster_urls: request.brokerage_poster_urls.as_ref().map_or(NotSet, |brokerage_poster_urls| Set(Some(brokerage_poster_urls.clone()))),
        brokerage_first_percent: Set(request.brokerage_first_percent.clone()),
        brokerage_second_percent: Set(request.brokerage_second_percent.clone()),
        brokerage_withdraw_min_price: Set(request.brokerage_withdraw_min_price.clone()),
        brokerage_withdraw_fee_percent: Set(request.brokerage_withdraw_fee_percent.clone()),
        brokerage_frozen_days: Set(request.brokerage_frozen_days.clone()),
        brokerage_withdraw_types: Set(request.brokerage_withdraw_types.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeConfigRequest, existing: MallTradeConfig) -> MallTradeConfigActiveModel {
    let mut active_model: MallTradeConfigActiveModel = existing.into();
    if let Some(after_sale_refund_reasons) = &request.after_sale_refund_reasons { 
        active_model.after_sale_refund_reasons = Set(after_sale_refund_reasons.clone());
    }
    if let Some(after_sale_return_reasons) = &request.after_sale_return_reasons { 
        active_model.after_sale_return_reasons = Set(after_sale_return_reasons.clone());
    }
    if let Some(delivery_express_free_enabled) = &request.delivery_express_free_enabled { 
        active_model.delivery_express_free_enabled = Set(delivery_express_free_enabled.clone());
    }
    if let Some(delivery_express_free_price) = &request.delivery_express_free_price { 
        active_model.delivery_express_free_price = Set(delivery_express_free_price.clone());
    }
    if let Some(delivery_pick_up_enabled) = &request.delivery_pick_up_enabled { 
        active_model.delivery_pick_up_enabled = Set(delivery_pick_up_enabled.clone());
    }
    if let Some(brokerage_enabled) = &request.brokerage_enabled { 
        active_model.brokerage_enabled = Set(brokerage_enabled.clone());
    }
    if let Some(brokerage_enabled_condition) = &request.brokerage_enabled_condition { 
        active_model.brokerage_enabled_condition = Set(brokerage_enabled_condition.clone());
    }
    if let Some(brokerage_bind_mode) = &request.brokerage_bind_mode { 
        active_model.brokerage_bind_mode = Set(brokerage_bind_mode.clone());
    }
    if let Some(brokerage_poster_urls) = &request.brokerage_poster_urls { 
        active_model.brokerage_poster_urls = Set(Some(brokerage_poster_urls.clone()));
    }
    if let Some(brokerage_first_percent) = &request.brokerage_first_percent { 
        active_model.brokerage_first_percent = Set(brokerage_first_percent.clone());
    }
    if let Some(brokerage_second_percent) = &request.brokerage_second_percent { 
        active_model.brokerage_second_percent = Set(brokerage_second_percent.clone());
    }
    if let Some(brokerage_withdraw_min_price) = &request.brokerage_withdraw_min_price { 
        active_model.brokerage_withdraw_min_price = Set(brokerage_withdraw_min_price.clone());
    }
    if let Some(brokerage_withdraw_fee_percent) = &request.brokerage_withdraw_fee_percent { 
        active_model.brokerage_withdraw_fee_percent = Set(brokerage_withdraw_fee_percent.clone());
    }
    if let Some(brokerage_frozen_days) = &request.brokerage_frozen_days { 
        active_model.brokerage_frozen_days = Set(brokerage_frozen_days.clone());
    }
    if let Some(brokerage_withdraw_types) = &request.brokerage_withdraw_types { 
        active_model.brokerage_withdraw_types = Set(brokerage_withdraw_types.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeConfig) -> MallTradeConfigResponse {
    MallTradeConfigResponse { 
        id: model.id,
        after_sale_refund_reasons: model.after_sale_refund_reasons,
        after_sale_return_reasons: model.after_sale_return_reasons,
        delivery_express_free_enabled: model.delivery_express_free_enabled,
        delivery_express_free_price: model.delivery_express_free_price,
        delivery_pick_up_enabled: model.delivery_pick_up_enabled,
        brokerage_enabled: model.brokerage_enabled,
        brokerage_enabled_condition: model.brokerage_enabled_condition,
        brokerage_bind_mode: model.brokerage_bind_mode,
        brokerage_poster_urls: model.brokerage_poster_urls,
        brokerage_first_percent: model.brokerage_first_percent,
        brokerage_second_percent: model.brokerage_second_percent,
        brokerage_withdraw_min_price: model.brokerage_withdraw_min_price,
        brokerage_withdraw_fee_percent: model.brokerage_withdraw_fee_percent,
        brokerage_frozen_days: model.brokerage_frozen_days,
        brokerage_withdraw_types: model.brokerage_withdraw_types,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}