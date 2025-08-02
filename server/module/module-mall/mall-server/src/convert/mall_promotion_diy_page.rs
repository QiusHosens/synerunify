use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_diy_page::{self, Model as MallPromotionDiyPage, ActiveModel as MallPromotionDiyPageActiveModel};
use mall_model::request::mall_promotion_diy_page::{CreateMallPromotionDiyPageRequest, UpdateMallPromotionDiyPageRequest};
use mall_model::response::mall_promotion_diy_page::MallPromotionDiyPageResponse;

pub fn create_request_to_model(request: &CreateMallPromotionDiyPageRequest) -> MallPromotionDiyPageActiveModel {
    MallPromotionDiyPageActiveModel {
        template_id: request.template_id.as_ref().map_or(NotSet, |template_id| Set(Some(template_id.clone()))),
        name: Set(request.name.clone()),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        preview_pic_urls: request.preview_pic_urls.as_ref().map_or(NotSet, |preview_pic_urls| Set(Some(preview_pic_urls.clone()))),
        property: request.property.as_ref().map_or(NotSet, |property| Set(Some(property.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionDiyPageRequest, existing: MallPromotionDiyPage) -> MallPromotionDiyPageActiveModel {
    let mut active_model: MallPromotionDiyPageActiveModel = existing.into();
    if let Some(template_id) = &request.template_id { 
        active_model.template_id = Set(Some(template_id.clone()));
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
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

pub fn model_to_response(model: MallPromotionDiyPage) -> MallPromotionDiyPageResponse {
    MallPromotionDiyPageResponse { 
        id: model.id,
        template_id: model.template_id,
        name: model.name,
        remark: model.remark,
        preview_pic_urls: model.preview_pic_urls,
        property: model.property,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}