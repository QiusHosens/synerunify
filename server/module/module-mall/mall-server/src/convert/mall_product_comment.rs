use sea_orm::{Set, NotSet};
use crate::model::mall_product_comment::{self, Model as MallProductComment, ActiveModel as MallProductCommentActiveModel};
use mall_model::request::mall_product_comment::{CreateMallProductCommentRequest, UpdateMallProductCommentRequest};
use mall_model::response::mall_product_comment::MallProductCommentResponse;

pub fn create_request_to_model(request: &CreateMallProductCommentRequest) -> MallProductCommentActiveModel {
    MallProductCommentActiveModel {
        user_id: Set(request.user_id.clone()),
        user_nickname: request.user_nickname.as_ref().map_or(NotSet, |user_nickname| Set(Some(user_nickname.clone()))),
        user_avatar: request.user_avatar.as_ref().map_or(NotSet, |user_avatar| Set(Some(user_avatar.clone()))),
        anonymous: Set(request.anonymous.clone()),
        order_id: request.order_id.as_ref().map_or(NotSet, |order_id| Set(Some(order_id.clone()))),
        order_item_id: request.order_item_id.as_ref().map_or(NotSet, |order_item_id| Set(Some(order_item_id.clone()))),
        spu_id: Set(request.spu_id.clone()),
        spu_name: request.spu_name.as_ref().map_or(NotSet, |spu_name| Set(Some(spu_name.clone()))),
        sku_id: Set(request.sku_id.clone()),
        sku_pic_url: Set(request.sku_pic_url.clone()),
        sku_properties: request.sku_properties.as_ref().map_or(NotSet, |sku_properties| Set(Some(sku_properties.clone()))),
        visible: request.visible.as_ref().map_or(NotSet, |visible| Set(Some(visible.clone()))),
        scores: Set(request.scores.clone()),
        description_scores: Set(request.description_scores.clone()),
        benefit_scores: Set(request.benefit_scores.clone()),
        content: Set(request.content.clone()),
        pic_urls: request.pic_urls.as_ref().map_or(NotSet, |pic_urls| Set(Some(pic_urls.clone()))),
        reply_status: request.reply_status.as_ref().map_or(NotSet, |reply_status| Set(Some(reply_status.clone()))),
        reply_user_id: request.reply_user_id.as_ref().map_or(NotSet, |reply_user_id| Set(Some(reply_user_id.clone()))),
        reply_content: request.reply_content.as_ref().map_or(NotSet, |reply_content| Set(Some(reply_content.clone()))),
        reply_time: request.reply_time.as_ref().map_or(NotSet, |reply_time| Set(Some(reply_time.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductCommentRequest, existing: MallProductComment) -> MallProductCommentActiveModel {
    let mut active_model: MallProductCommentActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(user_nickname) = &request.user_nickname { 
        active_model.user_nickname = Set(Some(user_nickname.clone()));
    }
    if let Some(user_avatar) = &request.user_avatar { 
        active_model.user_avatar = Set(Some(user_avatar.clone()));
    }
    if let Some(anonymous) = &request.anonymous { 
        active_model.anonymous = Set(anonymous.clone());
    }
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(Some(order_id.clone()));
    }
    if let Some(order_item_id) = &request.order_item_id { 
        active_model.order_item_id = Set(Some(order_item_id.clone()));
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(spu_name) = &request.spu_name { 
        active_model.spu_name = Set(Some(spu_name.clone()));
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(sku_id.clone());
    }
    if let Some(sku_pic_url) = &request.sku_pic_url { 
        active_model.sku_pic_url = Set(sku_pic_url.clone());
    }
    if let Some(sku_properties) = &request.sku_properties { 
        active_model.sku_properties = Set(Some(sku_properties.clone()));
    }
    if let Some(visible) = &request.visible { 
        active_model.visible = Set(Some(visible.clone()));
    }
    if let Some(scores) = &request.scores { 
        active_model.scores = Set(scores.clone());
    }
    if let Some(description_scores) = &request.description_scores { 
        active_model.description_scores = Set(description_scores.clone());
    }
    if let Some(benefit_scores) = &request.benefit_scores { 
        active_model.benefit_scores = Set(benefit_scores.clone());
    }
    if let Some(content) = &request.content { 
        active_model.content = Set(content.clone());
    }
    if let Some(pic_urls) = &request.pic_urls { 
        active_model.pic_urls = Set(Some(pic_urls.clone()));
    }
    if let Some(reply_status) = &request.reply_status { 
        active_model.reply_status = Set(Some(reply_status.clone()));
    }
    if let Some(reply_user_id) = &request.reply_user_id { 
        active_model.reply_user_id = Set(Some(reply_user_id.clone()));
    }
    if let Some(reply_content) = &request.reply_content { 
        active_model.reply_content = Set(Some(reply_content.clone()));
    }
    if let Some(reply_time) = &request.reply_time { 
        active_model.reply_time = Set(Some(reply_time.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallProductComment) -> MallProductCommentResponse {
    MallProductCommentResponse { 
        id: model.id,
        user_id: model.user_id,
        user_nickname: model.user_nickname,
        user_avatar: model.user_avatar,
        anonymous: model.anonymous,
        order_id: model.order_id,
        order_item_id: model.order_item_id,
        spu_id: model.spu_id,
        spu_name: model.spu_name,
        sku_id: model.sku_id,
        sku_pic_url: model.sku_pic_url,
        sku_properties: model.sku_properties,
        visible: model.visible,
        scores: model.scores,
        description_scores: model.description_scores,
        benefit_scores: model.benefit_scores,
        content: model.content,
        pic_urls: model.pic_urls,
        reply_status: model.reply_status,
        reply_user_id: model.reply_user_id,
        reply_content: model.reply_content,
        reply_time: model.reply_time,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}