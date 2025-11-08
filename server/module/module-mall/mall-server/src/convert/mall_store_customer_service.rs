use sea_orm::{Set, NotSet};
use crate::model::mall_store_customer_service::{self, Model as MallStoreCustomerService, ActiveModel as MallStoreCustomerServiceActiveModel};
use mall_model::request::mall_store_customer_service::{CreateMallStoreCustomerServiceRequest, UpdateMallStoreCustomerServiceRequest};
use mall_model::response::mall_store_customer_service::MallStoreCustomerServiceResponse;

pub fn create_request_to_model(request: &CreateMallStoreCustomerServiceRequest) -> MallStoreCustomerServiceActiveModel {
    MallStoreCustomerServiceActiveModel {
        store_id: Set(request.store_id.clone()),
        user_id: Set(request.user_id.clone()),
        name: Set(request.name.clone()),
        r#type: Set(request.r#type.clone()),
        sort: Set(request.sort.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallStoreCustomerServiceRequest, existing: MallStoreCustomerService) -> MallStoreCustomerServiceActiveModel {
    let mut active_model: MallStoreCustomerServiceActiveModel = existing.into();
    if let Some(store_id) = &request.store_id { 
        active_model.store_id = Set(store_id.clone());
    }
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(r#type) = &request.r#type { 
        active_model.r#type = Set(r#type.clone());
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    active_model
}

pub fn model_to_response(model: MallStoreCustomerService) -> MallStoreCustomerServiceResponse {
    MallStoreCustomerServiceResponse { 
        id: model.id,
        store_id: model.store_id,
        user_id: model.user_id,
        name: model.name,
        r#type: model.r#type,
        sort: model.sort,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}