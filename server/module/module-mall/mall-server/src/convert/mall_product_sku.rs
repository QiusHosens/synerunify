use sea_orm::{Set, NotSet};
use crate::model::mall_product_sku::{self, Model as MallProductSku, ActiveModel as MallProductSkuActiveModel};
use mall_model::request::mall_product_sku::{CreateMallProductSkuRequest, UpdateMallProductSkuRequest};
use mall_model::response::mall_product_sku::MallProductSkuResponse;

pub fn create_request_to_model(request: &CreateMallProductSkuRequest) -> MallProductSkuActiveModel {
    MallProductSkuActiveModel {
        spu_id: Set(request.spu_id.clone()),
        properties: request.properties.as_ref().map_or(NotSet, |properties| Set(Some(properties.clone()))),
        price: Set(request.price.clone()),
        market_price: request.market_price.as_ref().map_or(NotSet, |market_price| Set(Some(market_price.clone()))),
        cost_price: Set(request.cost_price.clone()),
        bar_code: request.bar_code.as_ref().map_or(NotSet, |bar_code| Set(Some(bar_code.clone()))),
        file_id: Set(request.file_id.clone()),
        stock: request.stock.as_ref().map_or(NotSet, |stock| Set(Some(stock.clone()))),
        weight: request.weight.as_ref().map_or(NotSet, |weight| Set(Some(weight.clone()))),
        volume: request.volume.as_ref().map_or(NotSet, |volume| Set(Some(volume.clone()))),
        first_brokerage_price: request.first_brokerage_price.as_ref().map_or(NotSet, |first_brokerage_price| Set(Some(first_brokerage_price.clone()))),
        second_brokerage_price: request.second_brokerage_price.as_ref().map_or(NotSet, |second_brokerage_price| Set(Some(second_brokerage_price.clone()))),
        sales_count: request.sales_count.as_ref().map_or(NotSet, |sales_count| Set(Some(sales_count.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductSkuRequest, existing: MallProductSku) -> MallProductSkuActiveModel {
    let mut active_model: MallProductSkuActiveModel = existing.into();
    if let Some(spu_id) = &request.spu_id { 
        active_model.spu_id = Set(spu_id.clone());
    }
    if let Some(properties) = &request.properties { 
        active_model.properties = Set(Some(properties.clone()));
    }
    if let Some(price) = &request.price { 
        active_model.price = Set(price.clone());
    }
    if let Some(market_price) = &request.market_price { 
        active_model.market_price = Set(Some(market_price.clone()));
    }
    if let Some(cost_price) = &request.cost_price { 
        active_model.cost_price = Set(cost_price.clone());
    }
    if let Some(bar_code) = &request.bar_code { 
        active_model.bar_code = Set(Some(bar_code.clone()));
    }
    if let Some(file_id) = &request.file_id { 
        active_model.file_id = Set(file_id.clone());
    }
    if let Some(stock) = &request.stock { 
        active_model.stock = Set(Some(stock.clone()));
    }
    if let Some(weight) = &request.weight { 
        active_model.weight = Set(Some(weight.clone()));
    }
    if let Some(volume) = &request.volume { 
        active_model.volume = Set(Some(volume.clone()));
    }
    if let Some(first_brokerage_price) = &request.first_brokerage_price { 
        active_model.first_brokerage_price = Set(Some(first_brokerage_price.clone()));
    }
    if let Some(second_brokerage_price) = &request.second_brokerage_price { 
        active_model.second_brokerage_price = Set(Some(second_brokerage_price.clone()));
    }
    if let Some(sales_count) = &request.sales_count { 
        active_model.sales_count = Set(Some(sales_count.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallProductSku) -> MallProductSkuResponse {
    MallProductSkuResponse { 
        id: model.id,
        spu_id: model.spu_id,
        properties: model.properties,
        price: model.price,
        market_price: model.market_price,
        cost_price: model.cost_price,
        bar_code: model.bar_code,
        file_id: model.file_id,
        stock: model.stock,
        weight: model.weight,
        volume: model.volume,
        first_brokerage_price: model.first_brokerage_price,
        second_brokerage_price: model.second_brokerage_price,
        sales_count: model.sales_count,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}