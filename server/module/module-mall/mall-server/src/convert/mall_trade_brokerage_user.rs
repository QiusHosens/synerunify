use sea_orm::{Set, NotSet};
use crate::model::mall_trade_brokerage_user::{self, Model as MallTradeBrokerageUser, ActiveModel as MallTradeBrokerageUserActiveModel};
use mall_model::request::mall_trade_brokerage_user::{CreateMallTradeBrokerageUserRequest, UpdateMallTradeBrokerageUserRequest};
use mall_model::response::mall_trade_brokerage_user::MallTradeBrokerageUserResponse;

pub fn create_request_to_model(request: &CreateMallTradeBrokerageUserRequest) -> MallTradeBrokerageUserActiveModel {
    MallTradeBrokerageUserActiveModel {
        bind_user_id: request.bind_user_id.as_ref().map_or(NotSet, |bind_user_id| Set(Some(bind_user_id.clone()))),
        bind_user_time: request.bind_user_time.as_ref().map_or(NotSet, |bind_user_time| Set(Some(bind_user_time.clone()))),
        brokerage_enabled: Set(request.brokerage_enabled.clone()),
        brokerage_time: request.brokerage_time.as_ref().map_or(NotSet, |brokerage_time| Set(Some(brokerage_time.clone()))),
        brokerage_price: Set(request.brokerage_price.clone()),
        frozen_price: Set(request.frozen_price.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeBrokerageUserRequest, existing: MallTradeBrokerageUser) -> MallTradeBrokerageUserActiveModel {
    let mut active_model: MallTradeBrokerageUserActiveModel = existing.into();
    if let Some(bind_user_id) = &request.bind_user_id { 
        active_model.bind_user_id = Set(Some(bind_user_id.clone()));
    }
    if let Some(bind_user_time) = &request.bind_user_time { 
        active_model.bind_user_time = Set(Some(bind_user_time.clone()));
    }
    if let Some(brokerage_enabled) = &request.brokerage_enabled { 
        active_model.brokerage_enabled = Set(brokerage_enabled.clone());
    }
    if let Some(brokerage_time) = &request.brokerage_time { 
        active_model.brokerage_time = Set(Some(brokerage_time.clone()));
    }
    if let Some(brokerage_price) = &request.brokerage_price { 
        active_model.brokerage_price = Set(brokerage_price.clone());
    }
    if let Some(frozen_price) = &request.frozen_price { 
        active_model.frozen_price = Set(frozen_price.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeBrokerageUser) -> MallTradeBrokerageUserResponse {
    MallTradeBrokerageUserResponse { 
        id: model.id,
        bind_user_id: model.bind_user_id,
        bind_user_time: model.bind_user_time,
        brokerage_enabled: model.brokerage_enabled,
        brokerage_time: model.brokerage_time,
        brokerage_price: model.brokerage_price,
        frozen_price: model.frozen_price,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}