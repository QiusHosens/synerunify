use sea_orm::{Set, NotSet};
use crate::model::mall_trade_statistics::{self, Model as MallTradeStatistics, ActiveModel as MallTradeStatisticsActiveModel};
use mall_model::request::mall_trade_statistics::{CreateMallTradeStatisticsRequest, UpdateMallTradeStatisticsRequest};
use mall_model::response::mall_trade_statistics::MallTradeStatisticsResponse;

pub fn create_request_to_model(request: &CreateMallTradeStatisticsRequest) -> MallTradeStatisticsActiveModel {
    MallTradeStatisticsActiveModel {
        time: Set(request.time.clone()),
        order_create_count: Set(request.order_create_count.clone()),
        order_pay_count: Set(request.order_pay_count.clone()),
        order_pay_price: Set(request.order_pay_price.clone()),
        after_sale_count: Set(request.after_sale_count.clone()),
        after_sale_refund_price: Set(request.after_sale_refund_price.clone()),
        brokerage_settlement_price: Set(request.brokerage_settlement_price.clone()),
        wallet_pay_price: Set(request.wallet_pay_price.clone()),
        recharge_pay_count: Set(request.recharge_pay_count.clone()),
        recharge_pay_price: Set(request.recharge_pay_price.clone()),
        recharge_refund_count: Set(request.recharge_refund_count.clone()),
        recharge_refund_price: Set(request.recharge_refund_price.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeStatisticsRequest, existing: MallTradeStatistics) -> MallTradeStatisticsActiveModel {
    let mut active_model: MallTradeStatisticsActiveModel = existing.into();
    if let Some(time) = &request.time { 
        active_model.time = Set(time.clone());
    }
    if let Some(order_create_count) = &request.order_create_count { 
        active_model.order_create_count = Set(order_create_count.clone());
    }
    if let Some(order_pay_count) = &request.order_pay_count { 
        active_model.order_pay_count = Set(order_pay_count.clone());
    }
    if let Some(order_pay_price) = &request.order_pay_price { 
        active_model.order_pay_price = Set(order_pay_price.clone());
    }
    if let Some(after_sale_count) = &request.after_sale_count { 
        active_model.after_sale_count = Set(after_sale_count.clone());
    }
    if let Some(after_sale_refund_price) = &request.after_sale_refund_price { 
        active_model.after_sale_refund_price = Set(after_sale_refund_price.clone());
    }
    if let Some(brokerage_settlement_price) = &request.brokerage_settlement_price { 
        active_model.brokerage_settlement_price = Set(brokerage_settlement_price.clone());
    }
    if let Some(wallet_pay_price) = &request.wallet_pay_price { 
        active_model.wallet_pay_price = Set(wallet_pay_price.clone());
    }
    if let Some(recharge_pay_count) = &request.recharge_pay_count { 
        active_model.recharge_pay_count = Set(recharge_pay_count.clone());
    }
    if let Some(recharge_pay_price) = &request.recharge_pay_price { 
        active_model.recharge_pay_price = Set(recharge_pay_price.clone());
    }
    if let Some(recharge_refund_count) = &request.recharge_refund_count { 
        active_model.recharge_refund_count = Set(recharge_refund_count.clone());
    }
    if let Some(recharge_refund_price) = &request.recharge_refund_price { 
        active_model.recharge_refund_price = Set(recharge_refund_price.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeStatistics) -> MallTradeStatisticsResponse {
    MallTradeStatisticsResponse { 
        id: model.id,
        time: model.time,
        order_create_count: model.order_create_count,
        order_pay_count: model.order_pay_count,
        order_pay_price: model.order_pay_price,
        after_sale_count: model.after_sale_count,
        after_sale_refund_price: model.after_sale_refund_price,
        brokerage_settlement_price: model.brokerage_settlement_price,
        wallet_pay_price: model.wallet_pay_price,
        recharge_pay_count: model.recharge_pay_count,
        recharge_pay_price: model.recharge_pay_price,
        recharge_refund_count: model.recharge_refund_count,
        recharge_refund_price: model.recharge_refund_price,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}