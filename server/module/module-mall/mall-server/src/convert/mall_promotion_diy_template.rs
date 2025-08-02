use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_diy_template::{self, Model as MallPromotionDiyTemplate, ActiveModel as MallPromotionDiyTemplateActiveModel};
use mall_model::request::mall_promotion_diy_template::{CreateMallPromotionDiyTemplateRequest, UpdateMallPromotionDiyTemplateRequest};
use mall_model::response::mall_promotion_diy_template::MallPromotionDiyTemplateResponse;

pub fn create_request_to_model(request: &CreateMallPromotionDiyTemplateRequest) -> MallPromotionDiyTemplateActiveModel {
    MallPromotionDiyTemplateActiveModel {
        name: Set(request.name.clone()),
        used: Set(request.used.clone()),
        used_time: request.used_time.as_ref().map_or(NotSet, |used_time| Set(Some(used_time.clone()))),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        preview_pic_urls: request.preview_pic_urls.as_ref().map_or(NotSet, |preview_pic_urls| Set(Some(preview_pic_urls.clone()))),
        property: request.property.as_ref().map_or(NotSet, |property| Set(Some(property.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionDiyTemplateRequest, existing: MallPromotionDiyTemplate) -> MallPromotionDiyTemplateActiveModel {
    let mut active_model: MallPromotionDiyTemplateActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(used) = &request.used { 
        active_model.used = Set(used.clone());
    }
    if let Some(used_time) = &request.used_time { 
        active_model.used_time = Set(Some(used_time.clone()));
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    if let Some(preview_pic_urls) = &request.preview_pic_urls { 
        active_model.preview_pic_urls = Set(Some(preview_pic_urls.clone()));
    }
    if let Some(property) = &request.property { 
        active_model.property = Set(Some(property.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallPromotionDiyTemplate) -> MallPromotionDiyTemplateResponse {
    MallPromotionDiyTemplateResponse { 
        id: model.id,
        name: model.name,
        used: model.used,
        used_time: model.used_time,
        remark: model.remark,
        preview_pic_urls: model.preview_pic_urls,
        property: model.property,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}