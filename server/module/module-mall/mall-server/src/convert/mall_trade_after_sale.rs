use sea_orm::{Set, NotSet};
use crate::model::mall_trade_after_sale::{self, Model as MallTradeAfterSale, ActiveModel as MallTradeAfterSaleActiveModel};
use mall_model::request::mall_trade_after_sale::{CreateMallTradeAfterSaleRequest, UpdateMallTradeAfterSaleRequest};
use mall_model::response::mall_trade_after_sale::MallTradeAfterSaleResponse;

pub fn create_request_to_model(request: &CreateMallTradeAfterSaleRequest) -> MallTradeAfterSaleActiveModel {
    MallTradeAfterSaleActiveModel {
        no: Set(request.no.clone()),
        r#type: request.r#type.as_ref().map_or(NotSet, |r#type| Set(Some(r#type.clone()))),
        status: Set(request.status.clone()),
        way: Set(request.way.clone()),
        user_id: Set(request.user_id.clone()),
        apply_reason: Set(request.apply_reason.clone()),
        apply_description: request.apply_description.as_ref().map_or(NotSet, |apply_description| Set(Some(apply_description.clone()))),
        apply_pic_urls: request.apply_pic_urls.as_ref().map_or(NotSet, |apply_pic_urls| Set(Some(apply_pic_urls.clone()))),
        order_id: Set(request.order_id.clone()),
        order_no: Set(request.order_no.clone()),
        order_item_Id: Set(request.order_item_Id.clone()),
        spu_id: Set(request.spu_id.clone()),
        spu_name: Set(request.spu_name.clone()),
        sku_id: Set(request.sku_id.clone()),
        properties: request.properties.as_ref().map_or(NotSet, |properties| Set(Some(properties.clone()))),
        pic_url: request.pic_url.as_ref().map_or(NotSet, |pic_url| Set(Some(pic_url.clone()))),
        count: Set(request.count.clone()),
        audit_time: request.audit_time.as_ref().map_or(NotSet, |audit_time| Set(Some(audit_time.clone()))),
        audit_user_id: request.audit_user_id.as_ref().map_or(NotSet, |audit_user_id| Set(Some(audit_user_id.clone()))),
        audit_reason: request.audit_reason.as_ref().map_or(NotSet, |audit_reason| Set(Some(audit_reason.clone()))),
        refund_price: Set(request.refund_price.clone()),
        pay_refund_id: request.pay_refund_id.as_ref().map_or(NotSet, |pay_refund_id| Set(Some(pay_refund_id.clone()))),
        refund_time: request.refund_time.as_ref().map_or(NotSet, |refund_time| Set(Some(refund_time.clone()))),
        logistics_id: request.logistics_id.as_ref().map_or(NotSet, |logistics_id| Set(Some(logistics_id.clone()))),
        logistics_no: request.logistics_no.as_ref().map_or(NotSet, |logistics_no| Set(Some(logistics_no.clone()))),
        delivery_time: request.delivery_time.as_ref().map_or(NotSet, |delivery_time| Set(Some(delivery_time.clone()))),
        receive_time: request.receive_time.as_ref().map_or(NotSet, |receive_time| Set(Some(receive_time.clone()))),
        receive_reason: request.receive_reason.as_ref().map_or(NotSet, |receive_reason| Set(Some(receive_reason.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeAfterSaleRequest, existing: MallTradeAfterSale) -> MallTradeAfterSaleActiveModel {
    let mut active_model: MallTradeAfterSaleActiveModel = existing.into();
    if let Some(no) = &request.no { 
        active_model.no = Set(no.clone());
    }
    if let Some(r#type) = &request.r#type { 
        active_model.r#type = Set(Some(r#type.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(way) = &request.way { 
        active_model.way = Set(way.clone());
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(apply_reason) = &request.apply_reason { 
        active_model.apply_reason = Set(apply_reason.clone());
    }
    if let Some(apply_description) = &request.apply_description { 
        active_model.apply_description = Set(Some(apply_description.clone()));
    }
    if let Some(apply_pic_urls) = &request.apply_pic_urls { 
        active_model.apply_pic_urls = Set(Some(apply_pic_urls.clone()));
    }
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(order_id.clone());
    }
    if let Some(order_no) = &request.order_no { 
        active_model.order_no = Set(order_no.clone());
    }
    if let Some(order_item_Id) = &request.order_item_Id { 
        active_model.order_item_Id = Set(order_item_Id.clone());
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
    if let Some(audit_time) = &request.audit_time { 
        active_model.audit_time = Set(Some(audit_time.clone()));
    }
    if let Some(audit_user_id) = &request.audit_user_id { 
        active_model.audit_user_id = Set(Some(audit_user_id.clone()));
    }
    if let Some(audit_reason) = &request.audit_reason { 
        active_model.audit_reason = Set(Some(audit_reason.clone()));
    }
    if let Some(refund_price) = &request.refund_price { 
        active_model.refund_price = Set(refund_price.clone());
    }
    if let Some(pay_refund_id) = &request.pay_refund_id { 
        active_model.pay_refund_id = Set(Some(pay_refund_id.clone()));
    }
    if let Some(refund_time) = &request.refund_time { 
        active_model.refund_time = Set(Some(refund_time.clone()));
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
    if let Some(receive_reason) = &request.receive_reason { 
        active_model.receive_reason = Set(Some(receive_reason.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallTradeAfterSale) -> MallTradeAfterSaleResponse {
    MallTradeAfterSaleResponse { 
        id: model.id,
        no: model.no,
        r#type: model.r#type,
        status: model.status,
        way: model.way,
        user_id: model.user_id,
        apply_reason: model.apply_reason,
        apply_description: model.apply_description,
        apply_pic_urls: model.apply_pic_urls,
        order_id: model.order_id,
        order_no: model.order_no,
        order_item_Id: model.order_item_Id,
        spu_id: model.spu_id,
        spu_name: model.spu_name,
        sku_id: model.sku_id,
        properties: model.properties,
        pic_url: model.pic_url,
        count: model.count,
        audit_time: model.audit_time,
        audit_user_id: model.audit_user_id,
        audit_reason: model.audit_reason,
        refund_price: model.refund_price,
        pay_refund_id: model.pay_refund_id,
        refund_time: model.refund_time,
        logistics_id: model.logistics_id,
        logistics_no: model.logistics_no,
        delivery_time: model.delivery_time,
        receive_time: model.receive_time,
        receive_reason: model.receive_reason,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}