use sea_orm::{Set, NotSet};
use crate::model::mall_product_statistics::{self, Model as MallProductStatistics, ActiveModel as MallProductStatisticsActiveModel};
use mall_model::request::mall_product_statistics::{CreateMallProductStatisticsRequest, UpdateMallProductStatisticsRequest};
use mall_model::response::mall_product_statistics::MallProductStatisticsResponse;

pub fn create_request_to_model(request: &CreateMallProductStatisticsRequest) -> MallProductStatisticsActiveModel {
    MallProductStatisticsActiveModel {
        time: Set(request.time.clone()),
        spu_id: Set(request.spu_id.clone()),
        browse_count: Set(request.browse_count.clone()),
        browse_user_count: Set(request.browse_user_count.clone()),
        favorite_count: Set(request.favorite_count.clone()),
        cart_count: Set(request.cart_count.clone()),
        order_count: Set(request.order_count.clone()),
        order_pay_count: Set(request.order_pay_count.clone()),
        order_pay_price: Set(request.order_pay_price.clone()),
        after_sale_count: Set(request.after_sale_count.clone()),
        after_sale_refund_price: Set(request.after_sale_refund_price.clone()),
        browse_convert_percent: Set(request.browse_convert_percent.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductStatisticsRequest, existing: MallProductStatistics) -> MallProductStatisticsActiveModel {
    let mut active_model: MallProductStatisticsActiveModel = existing.into();
    if let Some(time) = &request.time { 
        active_model.time = Set(time.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(browse_count) = &request.browse_count { 
        active_model.browse_count = Set(browse_count.clone());
    }
    if let Some(browse_user_count) = &request.browse_user_count { 
        active_model.browse_user_count = Set(browse_user_count.clone());
    }
    if let Some(favorite_count) = &request.favorite_count { 
        active_model.favorite_count = Set(favorite_count.clone());
    }
    if let Some(cart_count) = &request.cart_count { 
        active_model.cart_count = Set(cart_count.clone());
    }
    if let Some(order_count) = &request.order_count { 
        active_model.order_count = Set(order_count.clone());
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
    if let Some(browse_convert_percent) = &request.browse_convert_percent { 
        active_model.browse_convert_percent = Set(browse_convert_percent.clone());
    }
    active_model
}

pub fn model_to_response(model: MallProductStatistics) -> MallProductStatisticsResponse {
    MallProductStatisticsResponse { 
        id: model.id,
        time: model.time,
        spu_id: model.spu_id,
        browse_count: model.browse_count,
        browse_user_count: model.browse_user_count,
        favorite_count: model.favorite_count,
        cart_count: model.cart_count,
        order_count: model.order_count,
        order_pay_count: model.order_pay_count,
        order_pay_price: model.order_pay_price,
        after_sale_count: model.after_sale_count,
        after_sale_refund_price: model.after_sale_refund_price,
        browse_convert_percent: model.browse_convert_percent,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}