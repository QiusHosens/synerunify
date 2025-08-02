use sea_orm::{Set, NotSet};
use crate::model::mall_trade_order::{self, Model as MallTradeOrder, ActiveModel as MallTradeOrderActiveModel};
use mall_model::request::mall_trade_order::{CreateMallTradeOrderRequest, UpdateMallTradeOrderRequest};
use mall_model::response::mall_trade_order::MallTradeOrderResponse;

pub fn create_request_to_model(request: &CreateMallTradeOrderRequest) -> MallTradeOrderActiveModel {
    MallTradeOrderActiveModel {
        no: Set(request.no.clone()),
        r#type: Set(request.r#type.clone()),
        terminal: Set(request.terminal.clone()),
        user_id: Set(request.user_id.clone()),
        user_ip: Set(request.user_ip.clone()),
        user_remark: request.user_remark.as_ref().map_or(NotSet, |user_remark| Set(Some(user_remark.clone()))),
        status: Set(request.status.clone()),
        product_count: Set(request.product_count.clone()),
        cancel_type: request.cancel_type.as_ref().map_or(NotSet, |cancel_type| Set(Some(cancel_type.clone()))),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        comment_status: Set(request.comment_status.clone()),
        brokerage_user_id: request.brokerage_user_id.as_ref().map_or(NotSet, |brokerage_user_id| Set(Some(brokerage_user_id.clone()))),
        pay_order_id: request.pay_order_id.as_ref().map_or(NotSet, |pay_order_id| Set(Some(pay_order_id.clone()))),
        pay_status: Set(request.pay_status.clone()),
        pay_time: request.pay_time.as_ref().map_or(NotSet, |pay_time| Set(Some(pay_time.clone()))),
        pay_channel_code: request.pay_channel_code.as_ref().map_or(NotSet, |pay_channel_code| Set(Some(pay_channel_code.clone()))),
        finish_time: request.finish_time.as_ref().map_or(NotSet, |finish_time| Set(Some(finish_time.clone()))),
        cancel_time: request.cancel_time.as_ref().map_or(NotSet, |cancel_time| Set(Some(cancel_time.clone()))),
        total_price: Set(request.total_price.clone()),
        discount_price: Set(request.discount_price.clone()),
        delivery_price: Set(request.delivery_price.clone()),
        adjust_price: Set(request.adjust_price.clone()),
        pay_price: Set(request.pay_price.clone()),
        delivery_type: Set(request.delivery_type.clone()),
        logistics_id: request.logistics_id.as_ref().map_or(NotSet, |logistics_id| Set(Some(logistics_id.clone()))),
        logistics_no: request.logistics_no.as_ref().map_or(NotSet, |logistics_no| Set(Some(logistics_no.clone()))),
        delivery_time: request.delivery_time.as_ref().map_or(NotSet, |delivery_time| Set(Some(delivery_time.clone()))),
        receive_time: request.receive_time.as_ref().map_or(NotSet, |receive_time| Set(Some(receive_time.clone()))),
        receiver_name: Set(request.receiver_name.clone()),
        receiver_mobile: Set(request.receiver_mobile.clone()),
        receiver_area_id: request.receiver_area_id.as_ref().map_or(NotSet, |receiver_area_id| Set(Some(receiver_area_id.clone()))),
        receiver_detail_address: request.receiver_detail_address.as_ref().map_or(NotSet, |receiver_detail_address| Set(Some(receiver_detail_address.clone()))),
        pick_up_store_id: request.pick_up_store_id.as_ref().map_or(NotSet, |pick_up_store_id| Set(Some(pick_up_store_id.clone()))),
        pick_up_verify_code: request.pick_up_verify_code.as_ref().map_or(NotSet, |pick_up_verify_code| Set(Some(pick_up_verify_code.clone()))),
        refund_status: Set(request.refund_status.clone()),
        refund_price: Set(request.refund_price.clone()),
        coupon_id: request.coupon_id.as_ref().map_or(NotSet, |coupon_id| Set(Some(coupon_id.clone()))),
        coupon_price: Set(request.coupon_price.clone()),
        use_point: Set(request.use_point.clone()),
        point_price: Set(request.point_price.clone()),
        give_point: Set(request.give_point.clone()),
        refund_point: Set(request.refund_point.clone()),
        vip_price: Set(request.vip_price.clone()),
        give_coupon_template_counts: request.give_coupon_template_counts.as_ref().map_or(NotSet, |give_coupon_template_counts| Set(Some(give_coupon_template_counts.clone()))),
        give_coupon_ids: request.give_coupon_ids.as_ref().map_or(NotSet, |give_coupon_ids| Set(Some(give_coupon_ids.clone()))),
        seckill_activity_id: request.seckill_activity_id.as_ref().map_or(NotSet, |seckill_activity_id| Set(Some(seckill_activity_id.clone()))),
        bargain_activity_id: request.bargain_activity_id.as_ref().map_or(NotSet, |bargain_activity_id| Set(Some(bargain_activity_id.clone()))),
        bargain_record_id: request.bargain_record_id.as_ref().map_or(NotSet, |bargain_record_id| Set(Some(bargain_record_id.clone()))),
        combination_activity_id: request.combination_activity_id.as_ref().map_or(NotSet, |combination_activity_id| Set(Some(combination_activity_id.clone()))),
        combination_head_id: request.combination_head_id.as_ref().map_or(NotSet, |combination_head_id| Set(Some(combination_head_id.clone()))),
        combination_record_id: request.combination_record_id.as_ref().map_or(NotSet, |combination_record_id| Set(Some(combination_record_id.clone()))),
        point_activity_id: request.point_activity_id.as_ref().map_or(NotSet, |point_activity_id| Set(Some(point_activity_id.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeOrderRequest, existing: MallTradeOrder) -> MallTradeOrderActiveModel {
    let mut active_model: MallTradeOrderActiveModel = existing.into();
    if let Some(no) = &request.no { 
        active_model.no = Set(no.clone());
    }
    if let Some(r#type) = &request.r#type { 
        active_model.r#type = Set(r#type.clone());
    }
    if let Some(terminal) = &request.terminal { 
        active_model.terminal = Set(terminal.clone());
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(user_ip) = &request.user_ip { 
        active_model.user_ip = Set(user_ip.clone());
    }
    if let Some(user_remark) = &request.user_remark { 
        active_model.user_remark = Set(Some(user_remark.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(product_count) = &request.product_count { 
        active_model.product_count = Set(product_count.clone());
    }
    if let Some(cancel_type) = &request.cancel_type { 
        active_model.cancel_type = Set(Some(cancel_type.clone()));
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    if let Some(comment_status) = &request.comment_status { 
        active_model.comment_status = Set(comment_status.clone());
    }
    if let Some(brokerage_user_id) = &request.brokerage_user_id { 
        active_model.brokerage_user_id = Set(Some(brokerage_user_id.clone()));
    }
    if let Some(pay_order_id) = &request.pay_order_id { 
        active_model.pay_order_id = Set(Some(pay_order_id.clone()));
    }
    if let Some(pay_status) = &request.pay_status { 
        active_model.pay_status = Set(pay_status.clone());
    }
    if let Some(pay_time) = &request.pay_time { 
        active_model.pay_time = Set(Some(pay_time.clone()));
    }
    if let Some(pay_channel_code) = &request.pay_channel_code { 
        active_model.pay_channel_code = Set(Some(pay_channel_code.clone()));
    }
    if let Some(finish_time) = &request.finish_time { 
        active_model.finish_time = Set(Some(finish_time.clone()));
    }
    if let Some(cancel_time) = &request.cancel_time { 
        active_model.cancel_time = Set(Some(cancel_time.clone()));
    }
    if let Some(total_price) = &request.total_price { 
        active_model.total_price = Set(total_price.clone());
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
    if let Some(delivery_type) = &request.delivery_type { 
        active_model.delivery_type = Set(delivery_type.clone());
    }
    if let Some(logistics_id) = &request.logistics_id { 
        active_model.logistics_id = Set(Some(logistics_id.clone()));
    }
    if let Some(logistics_no) = &request.logistics_no { 
        active_model.logistics_no = Set(Some(logistics_no.clone()));
    }
    if let Some(delivery_time) = &request.delivery_time { 
        active_model.delivery_time = Set(Some(delivery_time.clone()));
    }
    if let Some(receive_time) = &request.receive_time { 
        active_model.receive_time = Set(Some(receive_time.clone()));
    }
    if let Some(receiver_name) = &request.receiver_name { 
        active_model.receiver_name = Set(receiver_name.clone());
    }
    if let Some(receiver_mobile) = &request.receiver_mobile { 
        active_model.receiver_mobile = Set(receiver_mobile.clone());
    }
    if let Some(receiver_area_id) = &request.receiver_area_id { 
        active_model.receiver_area_id = Set(Some(receiver_area_id.clone()));
    }
    if let Some(receiver_detail_address) = &request.receiver_detail_address { 
        active_model.receiver_detail_address = Set(Some(receiver_detail_address.clone()));
    }
    if let Some(pick_up_store_id) = &request.pick_up_store_id { 
        active_model.pick_up_store_id = Set(Some(pick_up_store_id.clone()));
    }
    if let Some(pick_up_verify_code) = &request.pick_up_verify_code { 
        active_model.pick_up_verify_code = Set(Some(pick_up_verify_code.clone()));
    }
    if let Some(refund_status) = &request.refund_status { 
        active_model.refund_status = Set(refund_status.clone());
    }
    if let Some(refund_price) = &request.refund_price { 
        active_model.refund_price = Set(refund_price.clone());
    }
    if let Some(coupon_id) = &request.coupon_id { 
        active_model.coupon_id = Set(Some(coupon_id.clone()));
    }
    if let Some(coupon_price) = &request.coupon_price { 
        active_model.coupon_price = Set(coupon_price.clone());
    }
    if let Some(use_point) = &request.use_point { 
        active_model.use_point = Set(use_point.clone());
    }
    if let Some(point_price) = &request.point_price { 
        active_model.point_price = Set(point_price.clone());
    }
    if let Some(give_point) = &request.give_point { 
        active_model.give_point = Set(give_point.clone());
    }
    if let Some(refund_point) = &request.refund_point { 
        active_model.refund_point = Set(refund_point.clone());
    }
    if let Some(vip_price) = &request.vip_price { 
        active_model.vip_price = Set(vip_price.clone());
    }
    if let Some(give_coupon_template_counts) = &request.give_coupon_template_counts { 
        active_model.give_coupon_template_counts = Set(Some(give_coupon_template_counts.clone()));
    }
    if let Some(give_coupon_ids) = &request.give_coupon_ids { 
        active_model.give_coupon_ids = Set(Some(give_coupon_ids.clone()));
    }
    if let Some(seckill_activity_id) = &request.seckill_activity_id { 
        active_model.seckill_activity_id = Set(Some(seckill_activity_id.clone()));
    }
    if let Some(bargain_activity_id) = &request.bargain_activity_id { 
        active_model.bargain_activity_id = Set(Some(bargain_activity_id.clone()));
    }
    if let Some(bargain_record_id) = &request.bargain_record_id { 
        active_model.bargain_record_id = Set(Some(bargain_record_id.clone()));
    }
    if let Some(combination_activity_id) = &request.combination_activity_id { 
        active_model.combination_activity_id = Set(Some(combination_activity_id.clone()));
    }
    if let Some(combination_head_id) = &request.combination_head_id { 
        active_model.combination_head_id = Set(Some(combination_head_id.clone()));
    }
    if let Some(combination_record_id) = &request.combination_record_id { 
        active_model.combination_record_id = Set(Some(combination_record_id.clone()));
    }
    if let Some(point_activity_id) = &request.point_activity_id { 
        active_model.point_activity_id = Set(Some(point_activity_id.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallTradeOrder) -> MallTradeOrderResponse {
    MallTradeOrderResponse { 
        id: model.id,
        no: model.no,
        r#type: model.r#type,
        terminal: model.terminal,
        user_id: model.user_id,
        user_ip: model.user_ip,
        user_remark: model.user_remark,
        status: model.status,
        product_count: model.product_count,
        cancel_type: model.cancel_type,
        remark: model.remark,
        comment_status: model.comment_status,
        brokerage_user_id: model.brokerage_user_id,
        pay_order_id: model.pay_order_id,
        pay_status: model.pay_status,
        pay_time: model.pay_time,
        pay_channel_code: model.pay_channel_code,
        finish_time: model.finish_time,
        cancel_time: model.cancel_time,
        total_price: model.total_price,
        discount_price: model.discount_price,
        delivery_price: model.delivery_price,
        adjust_price: model.adjust_price,
        pay_price: model.pay_price,
        delivery_type: model.delivery_type,
        logistics_id: model.logistics_id,
        logistics_no: model.logistics_no,
        delivery_time: model.delivery_time,
        receive_time: model.receive_time,
        receiver_name: model.receiver_name,
        receiver_mobile: model.receiver_mobile,
        receiver_area_id: model.receiver_area_id,
        receiver_detail_address: model.receiver_detail_address,
        pick_up_store_id: model.pick_up_store_id,
        pick_up_verify_code: model.pick_up_verify_code,
        refund_status: model.refund_status,
        refund_price: model.refund_price,
        coupon_id: model.coupon_id,
        coupon_price: model.coupon_price,
        use_point: model.use_point,
        point_price: model.point_price,
        give_point: model.give_point,
        refund_point: model.refund_point,
        vip_price: model.vip_price,
        give_coupon_template_counts: model.give_coupon_template_counts,
        give_coupon_ids: model.give_coupon_ids,
        seckill_activity_id: model.seckill_activity_id,
        bargain_activity_id: model.bargain_activity_id,
        bargain_record_id: model.bargain_record_id,
        combination_activity_id: model.combination_activity_id,
        combination_head_id: model.combination_head_id,
        combination_record_id: model.combination_record_id,
        point_activity_id: model.point_activity_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}