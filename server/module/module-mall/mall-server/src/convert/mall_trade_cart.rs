use sea_orm::{Set, NotSet};
use crate::model::mall_trade_cart::{self, Model as MallTradeCart, ActiveModel as MallTradeCartActiveModel};
use mall_model::request::mall_trade_cart::{CreateMallTradeCartRequest, UpdateMallTradeCartRequest};
use mall_model::response::mall_trade_cart::MallTradeCartResponse;

pub fn create_request_to_model(request: &CreateMallTradeCartRequest) -> MallTradeCartActiveModel {
    MallTradeCartActiveModel {
        user_id: Set(request.user_id.clone()),
        spu_id: Set(request.spu_id.clone()),
        sku_id: Set(request.sku_id.clone()),
        count: Set(request.count.clone()),
        selected: Set(request.selected.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeCartRequest, existing: MallTradeCart) -> MallTradeCartActiveModel {
    let mut active_model: MallTradeCartActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(sku_id.clone());
    }
    if let Some(count) = &request.count { 
        active_model.count = Set(count.clone());
    }
    if let Some(selected) = &request.selected { 
        active_model.selected = Set(selected.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeCart) -> MallTradeCartResponse {
    MallTradeCartResponse { 
        id: model.id,
        user_id: model.user_id,
        spu_id: model.spu_id,
        sku_id: model.sku_id,
        count: model.count,
        selected: model.selected,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}