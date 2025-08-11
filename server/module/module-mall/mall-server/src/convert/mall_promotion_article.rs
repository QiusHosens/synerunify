use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_article::{self, Model as MallPromotionArticle, ActiveModel as MallPromotionArticleActiveModel};
use mall_model::request::mall_promotion_article::{CreateMallPromotionArticleRequest, UpdateMallPromotionArticleRequest};
use mall_model::response::mall_promotion_article::MallPromotionArticleResponse;

pub fn create_request_to_model(request: &CreateMallPromotionArticleRequest) -> MallPromotionArticleActiveModel {
    MallPromotionArticleActiveModel {
        category_id: Set(request.category_id.clone()),
        spu_id: Set(request.spu_id.clone()),
        title: Set(request.title.clone()),
        author: request.author.as_ref().map_or(NotSet, |author| Set(Some(author.clone()))),
        file_id: Set(request.file_id.clone()),
        introduction: request.introduction.as_ref().map_or(NotSet, |introduction| Set(Some(introduction.clone()))),
        browse_count: request.browse_count.as_ref().map_or(NotSet, |browse_count| Set(Some(browse_count.clone()))),
        sort: Set(request.sort.clone()),
        status: Set(request.status.clone()),
        recommend_hot: Set(request.recommend_hot.clone()),
        recommend_banner: Set(request.recommend_banner.clone()),
        content: Set(request.content.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionArticleRequest, existing: MallPromotionArticle) -> MallPromotionArticleActiveModel {
    let mut active_model: MallPromotionArticleActiveModel = existing.into();
    if let Some(category_id) = &request.category_id { 
        active_model.category_id = Set(category_id.clone());
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(title) = &request.title { 
        active_model.title = Set(title.clone());
    }
    if let Some(author) = &request.author { 
        active_model.author = Set(Some(author.clone()));
    }
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(introduction) = &request.introduction { 
        active_model.introduction = Set(Some(introduction.clone()));
    }
    if let Some(browse_count) = &request.browse_count { 
        active_model.browse_count = Set(Some(browse_count.clone()));
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(recommend_hot) = &request.recommend_hot { 
        active_model.recommend_hot = Set(recommend_hot.clone());
    }
    if let Some(recommend_banner) = &request.recommend_banner { 
        active_model.recommend_banner = Set(recommend_banner.clone());
    }
    if let Some(content) = &request.content { 
        active_model.content = Set(content.clone());
    }
    active_model
}

pub fn model_to_response(model: MallPromotionArticle) -> MallPromotionArticleResponse {
    MallPromotionArticleResponse { 
        id: model.id,
        category_id: model.category_id,
        spu_id: model.spu_id,
        title: model.title,
        author: model.author,
        file_id: model.file_id,
        introduction: model.introduction,
        browse_count: model.browse_count,
        sort: model.sort,
        status: model.status,
        recommend_hot: model.recommend_hot,
        recommend_banner: model.recommend_banner,
        content: model.content,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}