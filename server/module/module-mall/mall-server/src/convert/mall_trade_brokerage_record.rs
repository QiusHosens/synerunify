use sea_orm::{Set, NotSet};
use crate::model::mall_trade_brokerage_record::{self, Model as MallTradeBrokerageRecord, ActiveModel as MallTradeBrokerageRecordActiveModel};
use mall_model::request::mall_trade_brokerage_record::{CreateMallTradeBrokerageRecordRequest, UpdateMallTradeBrokerageRecordRequest};
use mall_model::response::mall_trade_brokerage_record::MallTradeBrokerageRecordResponse;

pub fn create_request_to_model(request: &CreateMallTradeBrokerageRecordRequest) -> MallTradeBrokerageRecordActiveModel {
    MallTradeBrokerageRecordActiveModel {
        user_id: Set(request.user_id.clone()),
        biz_id: Set(request.biz_id.clone()),
        biz_type: Set(request.biz_type.clone()),
        title: Set(request.title.clone()),
        price: Set(request.price.clone()),
        total_price: Set(request.total_price.clone()),
        description: Set(request.description.clone()),
        status: Set(request.status.clone()),
        frozen_days: Set(request.frozen_days.clone()),
        unfreeze_time: request.unfreeze_time.as_ref().map_or(NotSet, |unfreeze_time| Set(Some(unfreeze_time.clone()))),
        source_user_level: Set(request.source_user_level.clone()),
        source_user_id: Set(request.source_user_id.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeBrokerageRecordRequest, existing: MallTradeBrokerageRecord) -> MallTradeBrokerageRecordActiveModel {
    let mut active_model: MallTradeBrokerageRecordActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(biz_id) = &request.biz_id { 
        active_model.biz_id = Set(biz_id.clone());
    }
    if let Some(biz_type) = &request.biz_type { 
        active_model.biz_type = Set(biz_type.clone());
    }
    if let Some(title) = &request.title { 
        active_model.title = Set(title.clone());
    }
    if let Some(price) = &request.price { 
        active_model.price = Set(price.clone());
    }
    if let Some(total_price) = &request.total_price { 
        active_model.total_price = Set(total_price.clone());
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(description.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(frozen_days) = &request.frozen_days { 
        active_model.frozen_days = Set(frozen_days.clone());
    }
    if let Some(unfreeze_time) = &request.unfreeze_time { 
        active_model.unfreeze_time = Set(Some(unfreeze_time.clone()));
    }
    if let Some(source_user_level) = &request.source_user_level { 
        active_model.source_user_level = Set(source_user_level.clone());
    }
    if let Some(source_user_id) = &request.source_user_id { 
        active_model.source_user_id = Set(source_user_id.clone());
    }
    active_model
}

pub fn model_to_response(model: MallTradeBrokerageRecord) -> MallTradeBrokerageRecordResponse {
    MallTradeBrokerageRecordResponse { 
        id: model.id,
        user_id: model.user_id,
        biz_id: model.biz_id,
        biz_type: model.biz_type,
        title: model.title,
        price: model.price,
        total_price: model.total_price,
        description: model.description,
        status: model.status,
        frozen_days: model.frozen_days,
        unfreeze_time: model.unfreeze_time,
        source_user_level: model.source_user_level,
        source_user_id: model.source_user_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}