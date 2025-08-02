use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_coupon::{self, Model as MallPromotionCoupon, ActiveModel as MallPromotionCouponActiveModel};
use mall_model::request::mall_promotion_coupon::{CreateMallPromotionCouponRequest, UpdateMallPromotionCouponRequest};
use mall_model::response::mall_promotion_coupon::MallPromotionCouponResponse;

pub fn create_request_to_model(request: &CreateMallPromotionCouponRequest) -> MallPromotionCouponActiveModel {
    MallPromotionCouponActiveModel {
        template_id: Set(request.template_id.clone()),
        name: Set(request.name.clone()),
        status: Set(request.status.clone()),
        user_id: Set(request.user_id.clone()),
        take_type: Set(request.take_type.clone()),
        use_price: Set(request.use_price.clone()),
        valid_start_time: Set(request.valid_start_time.clone()),
        valid_end_time: Set(request.valid_end_time.clone()),
        product_scope: Set(request.product_scope.clone()),
        product_scope_values: request.product_scope_values.as_ref().map_or(NotSet, |product_scope_values| Set(Some(product_scope_values.clone()))),
        discount_type: Set(request.discount_type.clone()),
        discount_percent: request.discount_percent.as_ref().map_or(NotSet, |discount_percent| Set(Some(discount_percent.clone()))),
        discount_price: request.discount_price.as_ref().map_or(NotSet, |discount_price| Set(Some(discount_price.clone()))),
        discount_limit_price: request.discount_limit_price.as_ref().map_or(NotSet, |discount_limit_price| Set(Some(discount_limit_price.clone()))),
        use_order_id: request.use_order_id.as_ref().map_or(NotSet, |use_order_id| Set(Some(use_order_id.clone()))),
        use_time: request.use_time.as_ref().map_or(NotSet, |use_time| Set(Some(use_time.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionCouponRequest, existing: MallPromotionCoupon) -> MallPromotionCouponActiveModel {
    let mut active_model: MallPromotionCouponActiveModel = existing.into();
    if let Some(template_id) = &request.template_id { 
        active_model.template_id = Set(template_id.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(take_type) = &request.take_type { 
        active_model.take_type = Set(take_type.clone());
    }
    if let Some(use_price) = &request.use_price { 
        active_model.use_price = Set(use_price.clone());
    }
    if let Some(valid_start_time) = &request.valid_start_time { 
        active_model.valid_start_time = Set(valid_start_time.clone());
    }
    if let Some(valid_end_time) = &request.valid_end_time { 
        active_model.valid_end_time = Set(valid_end_time.clone());
    }
    if let Some(product_scope) = &request.product_scope { 
        active_model.product_scope = Set(product_scope.clone());
    }
    if let Some(product_scope_values) = &request.product_scope_values { 
        active_model.product_scope_values = Set(Some(product_scope_values.clone()));
    }
    if let Some(discount_type) = &request.discount_type { 
        active_model.discount_type = Set(discount_type.clone());
    }
    if let Some(discount_percent) = &request.discount_percent { 
        active_model.discount_percent = Set(Some(discount_percent.clone()));
    }
    if let Some(discount_price) = &request.discount_price { 
        active_model.discount_price = Set(Some(discount_price.clone()));
    }
    if let Some(discount_limit_price) = &request.discount_limit_price { 
        active_model.discount_limit_price = Set(Some(discount_limit_price.clone()));
    }
    if let Some(use_order_id) = &request.use_order_id { 
        active_model.use_order_id = Set(Some(use_order_id.clone()));
    }
    if let Some(use_time) = &request.use_time { 
        active_model.use_time = Set(Some(use_time.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallPromotionCoupon) -> MallPromotionCouponResponse {
    MallPromotionCouponResponse { 
        id: model.id,
        template_id: model.template_id,
        name: model.name,
        status: model.status,
        user_id: model.user_id,
        take_type: model.take_type,
        use_price: model.use_price,
        valid_start_time: model.valid_start_time,
        valid_end_time: model.valid_end_time,
        product_scope: model.product_scope,
        product_scope_values: model.product_scope_values,
        discount_type: model.discount_type,
        discount_percent: model.discount_percent,
        discount_price: model.discount_price,
        discount_limit_price: model.discount_limit_price,
        use_order_id: model.use_order_id,
        use_time: model.use_time,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}