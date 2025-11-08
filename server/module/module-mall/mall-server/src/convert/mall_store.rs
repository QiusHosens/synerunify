use sea_orm::{Set, NotSet};
use crate::model::mall_store::{self, Model as MallStore, ActiveModel as MallStoreActiveModel};
use mall_model::request::mall_store::{CreateMallStoreRequest, UpdateMallStoreRequest};
use mall_model::response::mall_store::MallStoreResponse;

pub fn create_request_to_model(request: &CreateMallStoreRequest) -> MallStoreActiveModel {
    MallStoreActiveModel {
        number: Set(request.number.clone()),
        name: Set(request.name.clone()),
        short_name: request.short_name.as_ref().map_or(NotSet, |short_name| Set(Some(short_name.clone()))),
        file_id: Set(request.file_id.clone()),
        slider_file_ids: request.slider_file_ids.as_ref().map_or(NotSet, |slider_file_ids| Set(Some(slider_file_ids.clone()))),
        sort: request.sort.as_ref().map_or(NotSet, |sort| Set(Some(sort.clone()))),
        slogan: request.slogan.as_ref().map_or(NotSet, |slogan| Set(Some(slogan.clone()))),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        tags: request.tags.as_ref().map_or(NotSet, |tags| Set(Some(tags.clone()))),
        status: Set(request.status.clone()),
        audit_remark: request.audit_remark.as_ref().map_or(NotSet, |audit_remark| Set(Some(audit_remark.clone()))),
        audit_time: request.audit_time.as_ref().map_or(NotSet, |audit_time| Set(Some(audit_time.clone()))),
        score_desc: request.score_desc.as_ref().map_or(NotSet, |score_desc| Set(Some(score_desc.clone()))),
        score_service: request.score_service.as_ref().map_or(NotSet, |score_service| Set(Some(score_service.clone()))),
        score_delivery: request.score_delivery.as_ref().map_or(NotSet, |score_delivery| Set(Some(score_delivery.clone()))),
        total_sales_amount: request.total_sales_amount.as_ref().map_or(NotSet, |total_sales_amount| Set(Some(total_sales_amount.clone()))),
        total_order_count: request.total_order_count.as_ref().map_or(NotSet, |total_order_count| Set(Some(total_order_count.clone()))),
        total_goods_count: request.total_goods_count.as_ref().map_or(NotSet, |total_goods_count| Set(Some(total_goods_count.clone()))),
        total_fans_count: request.total_fans_count.as_ref().map_or(NotSet, |total_fans_count| Set(Some(total_fans_count.clone()))),
        is_recommend: request.is_recommend.as_ref().map_or(NotSet, |is_recommend| Set(Some(is_recommend.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallStoreRequest, existing: MallStore) -> MallStoreActiveModel {
    let mut active_model: MallStoreActiveModel = existing.into();
    if let Some(number) = &request.number { 
        active_model.number = Set(number.clone());
    }
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
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(audit_remark) = &request.audit_remark { 
        active_model.audit_remark = Set(Some(audit_remark.clone()));
    }
    if let Some(audit_time) = &request.audit_time { 
        active_model.audit_time = Set(Some(audit_time.clone()));
    }
    if let Some(score_desc) = &request.score_desc { 
        active_model.score_desc = Set(Some(score_desc.clone()));
    }
    if let Some(score_service) = &request.score_service { 
        active_model.score_service = Set(Some(score_service.clone()));
    }
    if let Some(score_delivery) = &request.score_delivery { 
        active_model.score_delivery = Set(Some(score_delivery.clone()));
    }
    if let Some(total_sales_amount) = &request.total_sales_amount { 
        active_model.total_sales_amount = Set(Some(total_sales_amount.clone()));
    }
    if let Some(total_order_count) = &request.total_order_count { 
        active_model.total_order_count = Set(Some(total_order_count.clone()));
    }
    if let Some(total_goods_count) = &request.total_goods_count { 
        active_model.total_goods_count = Set(Some(total_goods_count.clone()));
    }
    if let Some(total_fans_count) = &request.total_fans_count { 
        active_model.total_fans_count = Set(Some(total_fans_count.clone()));
    }
    if let Some(is_recommend) = &request.is_recommend { 
        active_model.is_recommend = Set(Some(is_recommend.clone()));
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