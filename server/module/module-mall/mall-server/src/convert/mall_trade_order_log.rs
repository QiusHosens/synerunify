use sea_orm::{Set, NotSet};
use crate::model::mall_trade_order_log::{self, Model as MallTradeOrderLog, ActiveModel as MallTradeOrderLogActiveModel};
use mall_model::request::mall_trade_order_log::{CreateMallTradeOrderLogRequest, UpdateMallTradeOrderLogRequest};
use mall_model::response::mall_trade_order_log::MallTradeOrderLogResponse;

pub fn create_request_to_model(request: &CreateMallTradeOrderLogRequest) -> MallTradeOrderLogActiveModel {
    MallTradeOrderLogActiveModel {
        user_id: Set(request.user_id.clone()),
        user_type: Set(request.user_type.clone()),
        order_id: Set(request.order_id.clone()),
        before_status: request.before_status.as_ref().map_or(NotSet, |before_status| Set(Some(before_status.clone()))),
        after_status: request.after_status.as_ref().map_or(NotSet, |after_status| Set(Some(after_status.clone()))),
        operate_type: Set(request.operate_type.clone()),
        content: Set(request.content.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeOrderLogRequest, existing: MallTradeOrderLog) -> MallTradeOrderLogActiveModel {
    let mut active_model: MallTradeOrderLogActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(user_type) = &request.user_type { 
        active_model.user_type = Set(user_type.clone());
    }
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(order_id.clone());
    }
    if let Some(before_status) = &request.before_status { 
        active_model.before_status = Set(Some(before_status.clone()));
    }
    if let Some(after_status) = &request.after_status { 
        active_model.after_status = Set(Some(after_status.clone()));
    }
    if let Some(operate_type) = &request.operate_type { 
        active_model.operate_type = Set(operate_type.clone());
    }
    if let Some(content) = &request.content { 
        active_model.content = Set(content.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeOrderLog) -> MallTradeOrderLogResponse {
    MallTradeOrderLogResponse { 
        id: model.id,
        user_id: model.user_id,
        user_type: model.user_type,
        order_id: model.order_id,
        before_status: model.before_status,
        after_status: model.after_status,
        operate_type: model.operate_type,
        content: model.content,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}