use sea_orm::{Set, NotSet};
use crate::model::mall_promotion_combination_record::{self, Model as MallPromotionCombinationRecord, ActiveModel as MallPromotionCombinationRecordActiveModel};
use mall_model::request::mall_promotion_combination_record::{CreateMallPromotionCombinationRecordRequest, UpdateMallPromotionCombinationRecordRequest};
use mall_model::response::mall_promotion_combination_record::MallPromotionCombinationRecordResponse;

pub fn create_request_to_model(request: &CreateMallPromotionCombinationRecordRequest) -> MallPromotionCombinationRecordActiveModel {
    MallPromotionCombinationRecordActiveModel {
        activity_id: request.activity_id.as_ref().map_or(NotSet, |activity_id| Set(Some(activity_id.clone()))),
        spu_id: request.spu_id.as_ref().map_or(NotSet, |spu_id| Set(Some(spu_id.clone()))),
        file_id: Set(request.file_id.clone()),
        spu_name: Set(request.spu_name.clone()),
        sku_id: request.sku_id.as_ref().map_or(NotSet, |sku_id| Set(Some(sku_id.clone()))),
        count: request.count.as_ref().map_or(NotSet, |count| Set(Some(count.clone()))),
        user_id: request.user_id.as_ref().map_or(NotSet, |user_id| Set(Some(user_id.clone()))),
        nickname: request.nickname.as_ref().map_or(NotSet, |nickname| Set(Some(nickname.clone()))),
        avatar: request.avatar.as_ref().map_or(NotSet, |avatar| Set(Some(avatar.clone()))),
        head_id: request.head_id.as_ref().map_or(NotSet, |head_id| Set(Some(head_id.clone()))),
        order_id: request.order_id.as_ref().map_or(NotSet, |order_id| Set(Some(order_id.clone()))),
        user_size: Set(request.user_size.clone()),
        user_count: Set(request.user_count.clone()),
        virtual_group: request.virtual_group.as_ref().map_or(NotSet, |virtual_group| Set(Some(virtual_group.clone()))),
        status: Set(request.status.clone()),
        combination_price: Set(request.combination_price.clone()),
        expire_time: Set(request.expire_time.clone()),
        start_time: request.start_time.as_ref().map_or(NotSet, |start_time| Set(Some(start_time.clone()))),
        end_time: request.end_time.as_ref().map_or(NotSet, |end_time| Set(Some(end_time.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallPromotionCombinationRecordRequest, existing: MallPromotionCombinationRecord) -> MallPromotionCombinationRecordActiveModel {
    let mut active_model: MallPromotionCombinationRecordActiveModel = existing.into();
    if let Some(activity_id) = &request.activity_id { 
        active_model.activity_id = Set(Some(activity_id.clone()));
    }
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(Some(spu_id.clone()));
    }
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(spu_name) = &request.spu_name { 
        active_model.spu_name = Set(spu_name.clone());
    }
    if let Some(sku_id) = &request.sku_id { 
        active_model.sku_id = Set(Some(sku_id.clone()));
    }
    if let Some(count) = &request.count { 
        active_model.count = Set(Some(count.clone()));
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(Some(user_id.clone()));
    }
    if let Some(nickname) = &request.nickname { 
        active_model.nickname = Set(Some(nickname.clone()));
    }
    if let Some(avatar) = &request.avatar { 
        active_model.avatar = Set(Some(avatar.clone()));
    }
    if let Some(head_id) = &request.head_id { 
        active_model.head_id = Set(Some(head_id.clone()));
    }
    if let Some(order_id) = &request.order_id { 
        active_model.order_id = Set(Some(order_id.clone()));
    }
    if let Some(user_size) = &request.user_size { 
        active_model.user_size = Set(user_size.clone());
    }
    if let Some(user_count) = &request.user_count { 
        active_model.user_count = Set(user_count.clone());
    }
    if let Some(virtual_group) = &request.virtual_group { 
        active_model.virtual_group = Set(Some(virtual_group.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(combination_price) = &request.combination_price { 
        active_model.combination_price = Set(combination_price.clone());
    }
    if let Some(expire_time) = &request.expire_time { 
        active_model.expire_time = Set(expire_time.clone());
    }
    if let Some(start_time) = &request.start_time { 
        active_model.start_time = Set(Some(start_time.clone()));
    }
    if let Some(end_time) = &request.end_time { 
        active_model.end_time = Set(Some(end_time.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallPromotionCombinationRecord) -> MallPromotionCombinationRecordResponse {
    MallPromotionCombinationRecordResponse { 
        id: model.id,
        activity_id: model.activity_id,
        spu_id: model.spu_id,
        file_id: model.file_id,
        spu_name: model.spu_name,
        sku_id: model.sku_id,
        count: model.count,
        user_id: model.user_id,
        nickname: model.nickname,
        avatar: model.avatar,
        head_id: model.head_id,
        order_id: model.order_id,
        user_size: model.user_size,
        user_count: model.user_count,
        virtual_group: model.virtual_group,
        status: model.status,
        combination_price: model.combination_price,
        expire_time: model.expire_time,
        start_time: model.start_time,
        end_time: model.end_time,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}