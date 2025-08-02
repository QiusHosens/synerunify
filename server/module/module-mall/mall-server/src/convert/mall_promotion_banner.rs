use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_banner::{self, Model as MallPromotionBanner, ActiveModel as MallPromotionBannerActiveModel};
use mall_model::request::mall_promotion_banner::{CreateMallPromotionBannerRequest, UpdateMallPromotionBannerRequest};
use mall_model::response::mall_promotion_banner::MallPromotionBannerResponse;

pub fn create_request_to_model(request: &CreateMallPromotionBannerRequest) -> MallPromotionBannerActiveModel {
    MallPromotionBannerActiveModel {
        title: Set(request.title.clone()),
        pic_url: Set(request.pic_url.clone()),
        url: Set(request.url.clone()),
        status: Set(request.status.clone()),
        sort: request.sort.as_ref().map_or(NotSet, |sort| Set(Some(sort.clone()))),
        position: Set(request.position.clone()),
        memo: request.memo.as_ref().map_or(NotSet, |memo| Set(Some(memo.clone()))),
        browse_count: request.browse_count.as_ref().map_or(NotSet, |browse_count| Set(Some(browse_count.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionBannerRequest, existing: MallPromotionBanner) -> MallPromotionBannerActiveModel {
    let mut active_model: MallPromotionBannerActiveModel = existing.into();
    if let Some(title) = &request.title { 
        active_model.title = Set(title.clone());
    }
    if let Some(pic_url) = &request.pic_url { 
        active_model.pic_url = Set(pic_url.clone());
    }
    if let Some(url) = &request.url { 
        active_model.url = Set(url.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(Some(sort.clone()));
    }
    if let Some(position) = &request.position { 
        active_model.position = Set(position.clone());
    }
    if let Some(memo) = &request.memo { 
        active_model.memo = Set(Some(memo.clone()));
    }
    if let Some(browse_count) = &request.browse_count { 
        active_model.browse_count = Set(Some(browse_count.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallPromotionBanner) -> MallPromotionBannerResponse {
    MallPromotionBannerResponse { 
        id: model.id,
        title: model.title,
        pic_url: model.pic_url,
        url: model.url,
        status: model.status,
        sort: model.sort,
        position: model.position,
        memo: model.memo,
        browse_count: model.browse_count,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}