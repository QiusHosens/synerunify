use sea_orm::{Set, NotSet};
use crate::model::erp_product_inventory::{self, Model as ErpProductInventory, ActiveModel as ErpProductInventoryActiveModel};
use crate::model::erp_product::{self, Model as ErpProduct};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit};
use crate::model::erp_warehouse::{self, Model as ErpWarehouse};
use erp_model::request::erp_product_inventory::{CreateErpProductInventoryRequest, UpdateErpProductInventoryRequest};
use erp_model::response::erp_product_inventory::{ErpProductInventoryPageResponse, ErpProductInventoryResponse};

pub fn create_request_to_model(request: &CreateErpProductInventoryRequest) -> ErpProductInventoryActiveModel {
    ErpProductInventoryActiveModel {
        product_id: Set(request.product_id.clone()),
        warehouse_id: Set(request.warehouse_id.clone()),
        stock_quantity: Set(request.stock_quantity.clone()),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpProductInventoryRequest, existing: ErpProductInventory) -> ErpProductInventoryActiveModel {
    let mut active_model: ErpProductInventoryActiveModel = existing.into();
    if let Some(product_id) = &request.product_id { 
        active_model.product_id = Set(product_id.clone());
    }
    if let Some(warehouse_id) = &request.warehouse_id { 
        active_model.warehouse_id = Set(warehouse_id.clone());
    }
    if let Some(stock_quantity) = &request.stock_quantity { 
        active_model.stock_quantity = Set(stock_quantity.clone());
    }
    active_model
}

pub fn model_to_response(model: ErpProductInventory) -> ErpProductInventoryResponse {
    ErpProductInventoryResponse { 
        id: model.id,
        product_id: model.product_id,
        warehouse_id: model.warehouse_id,
        stock_quantity: model.stock_quantity,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_page_response(model: ErpProductInventory, model_product: Option<ErpProduct>, model_warehouse: Option<ErpWarehouse>, model_unit: Option<ErpProductUnit>) -> ErpProductInventoryPageResponse {
    let product_name = model_product.map(|product| product.name.clone());
    let warehouse_name = model_warehouse.map(|warehouse| warehouse.name.clone());
    let unit_name = model_unit.map(|unit| unit.name.clone());

    ErpProductInventoryPageResponse { 
        id: model.id,
        product_id: model.product_id,
        warehouse_id: model.warehouse_id,
        stock_quantity: model.stock_quantity,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        product_name,
        warehouse_name,
        unit_name
    }
}