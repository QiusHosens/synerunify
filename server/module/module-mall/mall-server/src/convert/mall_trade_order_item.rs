use sea_orm::{Set, NotSet};
use crate::model::mall_trade_order_item::{self, Model as MallTradeOrderItem, ActiveModel as MallTradeOrderItemActiveModel};
use mall_model::request::mall_trade_order_item::{CreateMallTradeOrderItemRequest, UpdateMallTradeOrderItemRequest};
use mall_model::response::mall_trade_order_item::MallTradeOrderItemResponse;

pub fn create_request_to_model(request: &CreateMallTradeOrderItemRequest) -> MallTradeOrderItemActiveModel {
    MallTradeOrderItemActiveModel {
        user_id: Set(request.user_id.clone()),
        order_id: Set(request.order_id.clone()),
        cart_id: request.cart_id.as_ref().map_or(NotSet, |cart_id| Set(Some(cart_id.clone()))),
        spu_id: Set(request.spu_id.clone()),
        spu_name: Set(request.spu_name.clone()),
        sku_id: Set(request.sku_id.clone()),
        properties: request.properties.as_ref().map_or(NotSet, |properties| Set(Some(properties.clone()))),
        pic_url: request.pic_url.as_ref().map_or(NotSet, |pic_url| Set(Some(pic_url.clone()))),
        count: Set(request.count.clone()),
        comment_status: Set(request.comment_status.clone()),
        price: Set(request.price.clone()),
        discount_price: Set(request.discount_price.clone()),
        delivery_price: Set(request.delivery_price.clone()),
        adjust_price: Set(request.adjust_price.clone()),
        pay_price: Set(request.pay_price.clone()),
        coupon_price: Set(request.coupon_price.clone()),
        point_price: Set(request.point_price.clone()),
        use_point: Set(request.use_point.clone()),
        give_point: Set(request.give_point.clone()),
        vip_price: Set(request.vip_price.clone()),
        after_sale_id: request.after_sale_id.as_ref().map_or(NotSet, |after_sale_id| Set(Some(after_sale_id.clone()))),
        after_sale_status: Set(request.after_sale_status.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeOrderItemRequest, existing: MallTradeOrderItem) -> MallTradeOrderItemActiveModel {
    let mut active_model: MallTradeOrderItemActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(order_id.clone());
    }
    if let Some(cart_id) = &request.cart_id { 
        active_model.cart_id = Set(Some(cart_id.clone()));
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(spu_name) = &request.spu_name { 
        active_model.spu_name = Set(spu_name.clone());
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(sku_id.clone());
    }
    if let Some(properties) = &request.properties { 
        active_model.properties = Set(Some(properties.clone()));
    }
    if let Some(pic_url) = &request.pic_url { 
        active_model.pic_url = Set(Some(pic_url.clone()));
    }
    if let Some(count) = &request.count { 
        active_model.count = Set(count.clone());
    }
    if let Some(comment_status) = &request.comment_status { 
        active_model.comment_status = Set(comment_status.clone());
    }
    if let Some(price) = &request.price { 
        active_model.price = Set(price.clone());
    }
    if let Some(discount_price) = &request.discount_price { 
        active_model.discount_price = Set(discount_price.clone());
    }
    if let Some(delivery_price) = &request.delivery_price { 
        active_model.delivery_price = Set(delivery_price.clone());
    }
    if let Some(adjust_price) = &request.adjust_price { 
        active_model.adjust_price = Set(adjust_price.clone());
    }
    if let Some(pay_price) = &request.pay_price { 
        active_model.pay_price = Set(pay_price.clone());
    }
    if let Some(coupon_price) = &request.coupon_price { 
        active_model.coupon_price = Set(coupon_price.clone());
    }
    if let Some(point_price) = &request.point_price { 
        active_model.point_price = Set(point_price.clone());
    }
    if let Some(use_point) = &request.use_point { 
        active_model.use_point = Set(use_point.clone());
    }
    if let Some(give_point) = &request.give_point { 
        active_model.give_point = Set(give_point.clone());
    }
    if let Some(vip_price) = &request.vip_price { 
        active_model.vip_price = Set(vip_price.clone());
    }
    if let Some(after_sale_id) = &request.after_sale_id { 
        active_model.after_sale_id = Set(Some(after_sale_id.clone()));
    }
    if let Some(after_sale_status) = &request.after_sale_status { 
        active_model.after_sale_status = Set(after_sale_status.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeOrderItem) -> MallTradeOrderItemResponse {
    MallTradeOrderItemResponse { 
        id: model.id,
        user_id: model.user_id,
        order_id: model.order_id,
        cart_id: model.cart_id,
        spu_id: model.spu_id,
        spu_name: model.spu_name,
        sku_id: model.sku_id,
        properties: model.properties,
        pic_url: model.pic_url,
        count: model.count,
        comment_status: model.comment_status,
        price: model.price,
        discount_price: model.discount_price,
        delivery_price: model.delivery_price,
        adjust_price: model.adjust_price,
        pay_price: model.pay_price,
        coupon_price: model.coupon_price,
        point_price: model.point_price,
        use_point: model.use_point,
        give_point: model.give_point,
        vip_price: model.vip_price,
        after_sale_id: model.after_sale_id,
        after_sale_status: model.after_sale_status,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}