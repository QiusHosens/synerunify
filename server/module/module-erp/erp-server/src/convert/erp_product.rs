use sea_orm::{Set, NotSet};
use crate::model::erp_product::{self, Model as ErpProduct, ActiveModel as ErpProductActiveModel};
use crate::model::erp_product_unit::{self, Model as ErpProductUnit};
use crate::model::erp_product_inventory::{self, Model as ErpProductInventory};
use erp_model::request::erp_product::{CreateErpProductRequest, UpdateErpProductRequest};
use erp_model::response::erp_product::ErpProductResponse;

pub fn create_request_to_model(request: &CreateErpProductRequest) -> ErpProductActiveModel {
    ErpProductActiveModel {
        product_code: request.product_code.as_ref().map_or(NotSet, |product_code| Set(Some(product_code.clone()))),
        name: Set(request.name.clone()),
        category_id: request.category_id.as_ref().map_or(NotSet, |category_id| Set(Some(category_id.clone()))),
        unit_id: request.unit_id.as_ref().map_or(NotSet, |unit_id| Set(Some(unit_id.clone()))),
        status: Set(request.status.clone()),
        barcode: request.barcode.as_ref().map_or(NotSet, |barcode| Set(Some(barcode.clone()))),
        specification: request.specification.as_ref().map_or(NotSet, |specification| Set(Some(specification.clone()))),
        shelf_life_days: request.shelf_life_days.as_ref().map_or(NotSet, |shelf_life_days| Set(Some(shelf_life_days.clone()))),
        weight: request.weight.as_ref().map_or(NotSet, |weight| Set(Some(weight.clone()))),
        purchase_price: request.purchase_price.as_ref().map_or(NotSet, |purchase_price| Set(Some(purchase_price.clone()))),
        sale_price: request.sale_price.as_ref().map_or(NotSet, |sale_price| Set(Some(sale_price.clone()))),
        min_price: request.min_price.as_ref().map_or(NotSet, |min_price| Set(Some(min_price.clone()))),
        min_stock: Set(request.min_stock.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpProductRequest, existing: ErpProduct) -> ErpProductActiveModel {
    let mut active_model: ErpProductActiveModel = existing.into();
    if let Some(product_code) = &request.product_code { 
        active_model.product_code = Set(Some(product_code.clone()));
    }
    if let Some(name) = &request.name {
        active_model.name = Set(name.clone());
    }
    if let Some(category_id) = &request.category_id { 
        active_model.category_id = Set(Some(category_id.clone()));
    }
    if let Some(unit_id) = &request.unit_id { 
        active_model.unit_id = Set(Some(unit_id.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(barcode) = &request.barcode { 
        active_model.barcode = Set(Some(barcode.clone()));
    }
    if let Some(specification) = &request.specification { 
        active_model.specification = Set(Some(specification.clone()));
    }
    if let Some(shelf_life_days) = &request.shelf_life_days { 
        active_model.shelf_life_days = Set(Some(shelf_life_days.clone()));
    }
    if let Some(weight) = &request.weight { 
        active_model.weight = Set(Some(weight.clone()));
    }
    if let Some(purchase_price) = &request.purchase_price { 
        active_model.purchase_price = Set(Some(purchase_price.clone()));
    }
    if let Some(sale_price) = &request.sale_price { 
        active_model.sale_price = Set(Some(sale_price.clone()));
    }
    if let Some(min_price) = &request.min_price { 
        active_model.min_price = Set(Some(min_price.clone()));
    }
    if let Some(min_stock) = &request.min_stock { 
        active_model.min_stock = Set(min_stock.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpProduct, model_unit: Option<ErpProductUnit>, model_inventory: Option<ErpProductInventory>) -> ErpProductResponse {
    let unit_name = model_unit.map(|unit| unit.name.clone());
    let stock_quantity = model_inventory.map(|inventory| inventory.stock_quantity).unwrap_or(0);

    ErpProductResponse { 
        id: model.id,
        product_code: model.product_code,
        name: model.name,
        category_id: model.category_id,
        unit_id: model.unit_id,
        status: model.status,
        barcode: model.barcode,
        specification: model.specification,
        shelf_life_days: model.shelf_life_days,
        weight: model.weight,
        purchase_price: model.purchase_price,
        sale_price: model.sale_price,
        min_price: model.min_price,
        min_stock: model.min_stock,
        remarks: model.remarks,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        stock_quantity,
        unit_name,
    }
}