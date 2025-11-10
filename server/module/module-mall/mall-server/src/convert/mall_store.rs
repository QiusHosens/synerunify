use sea_orm::{Set, NotSet};
use crate::model::mall_store::{self, Model as MallStore, ActiveModel as MallStoreActiveModel};
use mall_model::request::mall_store::{CreateMallStoreRequest, UpdateMallStoreRequest};
use mall_model::response::mall_store::MallStoreResponse;

pub fn create_request_to_model(request: &CreateMallStoreRequest) -> MallStoreActiveModel {
    MallStoreActiveModel {
        name: Set(request.name.clone()),
        short_name: request.short_name.as_ref().map_or(NotSet, |short_name| Set(Some(short_name.clone()))),
        file_id: Set(request.file_id.clone()),
        slider_file_ids: request.slider_file_ids.as_ref().map_or(NotSet, |slider_file_ids| Set(Some(slider_file_ids.clone()))),
        sort: request.sort.as_ref().map_or(NotSet, |sort| Set(Some(sort.clone()))),
        slogan: request.slogan.as_ref().map_or(NotSet, |slogan| Set(Some(slogan.clone()))),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        tags: request.tags.as_ref().map_or(NotSet, |tags| Set(Some(tags.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallStoreRequest, existing: MallStore) -> MallStoreActiveModel {
    let mut active_model: MallStoreActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(short_name) = &request.short_name { 
        active_model.short_name = Set(Some(short_name.clone()));
    }
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(slider_file_ids) = &request.slider_file_ids { 
        active_model.slider_file_ids = Set(Some(slider_file_ids.clone()));
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(Some(sort.clone()));
    }
    if let Some(slogan) = &request.slogan { 
        active_model.slogan = Set(Some(slogan.clone()));
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(tags) = &request.tags { 
        active_model.tags = Set(Some(tags.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallStore) -> MallStoreResponse {
    MallStoreResponse { 
        id: model.id,
        number: model.number,
        name: model.name,
        short_name: model.short_name,
        file_id: model.file_id,
        slider_file_ids: model.slider_file_ids,
        sort: model.sort,
        slogan: model.slogan,
        description: model.description,
        tags: model.tags,
        status: model.status,
        audit_remark: model.audit_remark,
        audit_time: model.audit_time,
        score_desc: model.score_desc,
        score_service: model.score_service,
        score_delivery: model.score_delivery,
        total_sales_amount: model.total_sales_amount,
        total_order_count: model.total_order_count,
        total_goods_count: model.total_goods_count,
        total_fans_count: model.total_fans_count,
        is_recommend: model.is_recommend,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}