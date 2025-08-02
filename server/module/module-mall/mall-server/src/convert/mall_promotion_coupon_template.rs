use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_coupon_template::{self, Model as MallPromotionCouponTemplate, ActiveModel as MallPromotionCouponTemplateActiveModel};
use mall_model::request::mall_promotion_coupon_template::{CreateMallPromotionCouponTemplateRequest, UpdateMallPromotionCouponTemplateRequest};
use mall_model::response::mall_promotion_coupon_template::MallPromotionCouponTemplateResponse;

pub fn create_request_to_model(request: &CreateMallPromotionCouponTemplateRequest) -> MallPromotionCouponTemplateActiveModel {
    MallPromotionCouponTemplateActiveModel {
        name: Set(request.name.clone()),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        status: Set(request.status.clone()),
        total_count: Set(request.total_count.clone()),
        take_limit_count: Set(request.take_limit_count.clone()),
        take_type: Set(request.take_type.clone()),
        use_price: Set(request.use_price.clone()),
        product_scope: Set(request.product_scope.clone()),
        product_scope_values: request.product_scope_values.as_ref().map_or(NotSet, |product_scope_values| Set(Some(product_scope_values.clone()))),
        validity_type: Set(request.validity_type.clone()),
        valid_start_time: request.valid_start_time.as_ref().map_or(NotSet, |valid_start_time| Set(Some(valid_start_time.clone()))),
        valid_end_time: request.valid_end_time.as_ref().map_or(NotSet, |valid_end_time| Set(Some(valid_end_time.clone()))),
        fixed_start_term: request.fixed_start_term.as_ref().map_or(NotSet, |fixed_start_term| Set(Some(fixed_start_term.clone()))),
        fixed_end_term: request.fixed_end_term.as_ref().map_or(NotSet, |fixed_end_term| Set(Some(fixed_end_term.clone()))),
        discount_type: Set(request.discount_type.clone()),
        discount_percent: request.discount_percent.as_ref().map_or(NotSet, |discount_percent| Set(Some(discount_percent.clone()))),
        discount_price: request.discount_price.as_ref().map_or(NotSet, |discount_price| Set(Some(discount_price.clone()))),
        discount_limit_price: request.discount_limit_price.as_ref().map_or(NotSet, |discount_limit_price| Set(Some(discount_limit_price.clone()))),
        take_count: Set(request.take_count.clone()),
        use_count: Set(request.use_count.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionCouponTemplateRequest, existing: MallPromotionCouponTemplate) -> MallPromotionCouponTemplateActiveModel {
    let mut active_model: MallPromotionCouponTemplateActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(total_count) = &request.total_count { 
        active_model.total_count = Set(total_count.clone());
    }
    if let Some(take_limit_count) = &request.take_limit_count { 
        active_model.take_limit_count = Set(take_limit_count.clone());
    }
    if let Some(take_type) = &request.take_type { 
        active_model.take_type = Set(take_type.clone());
    }
    if let Some(use_price) = &request.use_price { 
        active_model.use_price = Set(use_price.clone());
    }
    if let Some(product_scope) = &request.product_scope { 
        active_model.product_scope = Set(product_scope.clone());
    }
    if let Some(product_scope_values) = &request.product_scope_values { 
        active_model.product_scope_values = Set(Some(product_scope_values.clone()));
    }
    if let Some(validity_type) = &request.validity_type { 
        active_model.validity_type = Set(validity_type.clone());
    }
    if let Some(valid_start_time) = &request.valid_start_time { 
        active_model.valid_start_time = Set(Some(valid_start_time.clone()));
    }
    if let Some(valid_end_time) = &request.valid_end_time { 
        active_model.valid_end_time = Set(Some(valid_end_time.clone()));
    }
    if let Some(fixed_start_term) = &request.fixed_start_term { 
        active_model.fixed_start_term = Set(Some(fixed_start_term.clone()));
    }
    if let Some(fixed_end_term) = &request.fixed_end_term { 
        active_model.fixed_end_term = Set(Some(fixed_end_term.clone()));
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
    if let Some(take_count) = &request.take_count { 
        active_model.take_count = Set(take_count.clone());
    }
    if let Some(use_count) = &request.use_count { 
        active_model.use_count = Set(use_count.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionCouponTemplate) -> MallPromotionCouponTemplateResponse {
    MallPromotionCouponTemplateResponse { 
        id: model.id,
        name: model.name,
        description: model.description,
        status: model.status,
        total_count: model.total_count,
        take_limit_count: model.take_limit_count,
        take_type: model.take_type,
        use_price: model.use_price,
        product_scope: model.product_scope,
        product_scope_values: model.product_scope_values,
        validity_type: model.validity_type,
        valid_start_time: model.valid_start_time,
        valid_end_time: model.valid_end_time,
        fixed_start_term: model.fixed_start_term,
        fixed_end_term: model.fixed_end_term,
        discount_type: model.discount_type,
        discount_percent: model.discount_percent,
        discount_price: model.discount_price,
        discount_limit_price: model.discount_limit_price,
        take_count: model.take_count,
        use_count: model.use_count,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}