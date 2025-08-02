use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_article_category::{self, Model as MallPromotionArticleCategory, ActiveModel as MallPromotionArticleCategoryActiveModel};
use mall_model::request::mall_promotion_article_category::{CreateMallPromotionArticleCategoryRequest, UpdateMallPromotionArticleCategoryRequest};
use mall_model::response::mall_promotion_article_category::MallPromotionArticleCategoryResponse;

pub fn create_request_to_model(request: &CreateMallPromotionArticleCategoryRequest) -> MallPromotionArticleCategoryActiveModel {
    MallPromotionArticleCategoryActiveModel {
        name: Set(request.name.clone()),
        pic_url: request.pic_url.as_ref().map_or(NotSet, |pic_url| Set(Some(pic_url.clone()))),
        status: Set(request.status.clone()),
        sort: Set(request.sort.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionArticleCategoryRequest, existing: MallPromotionArticleCategory) -> MallPromotionArticleCategoryActiveModel {
    let mut active_model: MallPromotionArticleCategoryActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(pic_url) = &request.pic_url { 
        active_model.pic_url = Set(Some(pic_url.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionArticleCategory) -> MallPromotionArticleCategoryResponse {
    MallPromotionArticleCategoryResponse { 
        id: model.id,
        name: model.name,
        pic_url: model.pic_url,
        status: model.status,
        sort: model.sort,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}