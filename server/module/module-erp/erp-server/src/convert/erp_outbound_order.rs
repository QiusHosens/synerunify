use erp_model::response::erp_outbound_order_attachment::ErpOutboundOrderAttachmentBaseResponse;
use erp_model::response::erp_outbound_order_detail::{ErpOutboundOrderDetailBaseOtherResponse, ErpOutboundOrderDetailBaseSalesResponse};
use sea_orm::{Set, NotSet};
use crate::model::erp_outbound_order::{self, Model as ErpOutboundOrder, ActiveModel as ErpOutboundOrderActiveModel};
use crate::model::erp_sales_order::{self, Model as ErpSalesOrder};
use crate::model::erp_customer::{self, Model as ErpCustomer};
use crate::model::erp_settlement_account::{self, Model as ErpSettlementAccount};
use erp_model::request::erp_outbound_order::{CreateErpOutboundOrderOtherRequest, CreateErpOutboundOrderRequest, CreateErpOutboundOrderSaleRequest, UpdateErpOutboundOrderOtherRequest, UpdateErpOutboundOrderRequest, UpdateErpOutboundOrderSaleRequest};
use erp_model::response::erp_outbound_order::{ErpOutboundOrderBaseOtherResponse, ErpOutboundOrderBaseSalesResponse, ErpOutboundOrderInfoSalesResponse, ErpOutboundOrderPageOtherResponse, ErpOutboundOrderPageSalesResponse, ErpOutboundOrderResponse};

pub fn create_request_to_model(request: &CreateErpOutboundOrderRequest) -> ErpOutboundOrderActiveModel {
    ErpOutboundOrderActiveModel {
        sale_id: request.sale_id.as_ref().map_or(NotSet, |sale_id| Set(Some(sale_id.clone()))),
        outbound_date: Set(request.outbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        other_cost: request.other_cost.as_ref().map_or(NotSet, |other_cost| Set(Some(other_cost.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        department_code: Set(request.department_code.clone()),
        department_id: Set(request.department_id.clone()),
        ..Default::default()
    }
}

pub fn create_sale_request_to_model(request: &CreateErpOutboundOrderSaleRequest) -> ErpOutboundOrderActiveModel {
    ErpOutboundOrderActiveModel {
        sale_id: Set(Some(request.sale_id.clone())),
        outbound_date: Set(request.outbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        other_cost: request.other_cost.as_ref().map_or(NotSet, |other_cost| Set(Some(other_cost.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        ..Default::default()
    }
}

pub fn create_other_request_to_model(request: &CreateErpOutboundOrderOtherRequest) -> ErpOutboundOrderActiveModel {
    ErpOutboundOrderActiveModel {
        customer_id: Set(request.customer_id.clone()),
        outbound_date: Set(request.outbound_date.clone()),
        remarks: request.remarks.as_ref().map_or(NotSet, |remarks| Set(Some(remarks.clone()))),
        discount_rate: request.discount_rate.as_ref().map_or(NotSet, |discount_rate| Set(Some(discount_rate.clone()))),
        other_cost: request.other_cost.as_ref().map_or(NotSet, |other_cost| Set(Some(other_cost.clone()))),
        settlement_account_id: request.settlement_account_id.as_ref().map_or(NotSet, |settlement_account_id| Set(Some(settlement_account_id.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateErpOutboundOrderRequest, existing: ErpOutboundOrder) -> ErpOutboundOrderActiveModel {
    let mut active_model: ErpOutboundOrderActiveModel = existing.into();
    if let Some(sale_id) = &request.sale_id { 
        active_model.sale_id = Set(Some(sale_id.clone()));
    }
    if let Some(outbound_date) = &request.outbound_date { 
        active_model.outbound_date = Set(outbound_date.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    if let Some(discount_rate) = &request.discount_rate { 
        active_model.discount_rate = Set(Some(discount_rate.clone()));
    }
    if let Some(other_cost) = &request.other_cost { 
        active_model.other_cost = Set(Some(other_cost.clone()));
    }
    if let Some(settlement_account_id) = &request.settlement_account_id { 
        active_model.settlement_account_id = Set(Some(settlement_account_id.clone()));
    }
    if let Some(department_code) = &request.department_code { 
        active_model.department_code = Set(department_code.clone());
    }
    if let Some(department_id) = &request.department_id { 
        active_model.department_id = Set(department_id.clone());
    }
    active_model
}

pub fn update_sale_request_to_model(request: &UpdateErpOutboundOrderSaleRequest, existing: ErpOutboundOrder) -> ErpOutboundOrderActiveModel {
    let mut active_model: ErpOutboundOrderActiveModel = existing.into();
    if let Some(outbound_date) = &request.outbound_date { 
        active_model.outbound_date = Set(outbound_date.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    if let Some(discount_rate) = &request.discount_rate { 
        active_model.discount_rate = Set(Some(discount_rate.clone()));
    }
    if let Some(other_cost) = &request.other_cost { 
        active_model.other_cost = Set(Some(other_cost.clone()));
    }
    if let Some(settlement_account_id) = &request.settlement_account_id { 
        active_model.settlement_account_id = Set(Some(settlement_account_id.clone()));
    }
    active_model
}

pub fn update_other_request_to_model(request: &UpdateErpOutboundOrderOtherRequest, existing: ErpOutboundOrder) -> ErpOutboundOrderActiveModel {
    let mut active_model: ErpOutboundOrderActiveModel = existing.into();
    if let customer_id = &request.customer_id { 
        active_model.customer_id = Set(customer_id.clone());
    }
    if let Some(outbound_date) = &request.outbound_date { 
        active_model.outbound_date = Set(outbound_date.clone());
    }
    if let Some(remarks) = &request.remarks { 
        active_model.remarks = Set(Some(remarks.clone()));
    }
    if let Some(discount_rate) = &request.discount_rate { 
        active_model.discount_rate = Set(Some(discount_rate.clone()));
    }
    if let Some(other_cost) = &request.other_cost { 
        active_model.other_cost = Set(Some(other_cost.clone()));
    }
    if let Some(settlement_account_id) = &request.settlement_account_id { 
        active_model.settlement_account_id = Set(Some(settlement_account_id.clone()));
    }
    active_model
}

pub fn model_to_response(model: ErpOutboundOrder) -> ErpOutboundOrderResponse {
    ErpOutboundOrderResponse { 
        id: model.id,
        order_number: model.order_number,
        sale_id: model.sale_id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        outbound_date: model.outbound_date,
        remarks: model.remarks,
        discount_rate: model.discount_rate,
        other_cost: model.other_cost,
        settlement_account_id: model.settlement_account_id,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}

pub fn model_to_page_sales_response(model: ErpOutboundOrder, model_sales: Option<ErpSalesOrder>, model_customer: Option<ErpCustomer>, model_settlement_account: Option<ErpSettlementAccount>) -> ErpOutboundOrderPageSalesResponse {
    let sale_order_number = model_sales.map(|sales| sales.order_number.clone());
    let customer_name = model_customer.map(|customer| customer.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpOutboundOrderPageSalesResponse { 
        id: model.id,
        order_number: model.order_number,
        sale_id: model.sale_id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        outbound_date: model.outbound_date,
        remarks: model.remarks,
        discount_rate: model.discount_rate,
        other_cost: model.other_cost,
        settlement_account_id: model.settlement_account_id,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        sale_order_number,
        customer_name,
        settlement_account_name,
    }
}

pub fn model_to_page_other_response(model: ErpOutboundOrder, model_customer: Option<ErpCustomer>, model_settlement_account: Option<ErpSettlementAccount>) -> ErpOutboundOrderPageOtherResponse {
    let customer_name = model_customer.map(|customer| customer.name.clone());
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpOutboundOrderPageOtherResponse { 
        id: model.id,
        order_number: model.order_number,
        sale_id: model.sale_id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        outbound_date: model.outbound_date,
        remarks: model.remarks,
        discount_rate: model.discount_rate,
        other_cost: model.other_cost,
        settlement_account_id: model.settlement_account_id,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        customer_name,
        settlement_account_name,
    }
}

pub fn model_to_base_sales_response(model: ErpOutboundOrder, details: Vec<ErpOutboundOrderDetailBaseSalesResponse>, attachments: Vec<ErpOutboundOrderAttachmentBaseResponse>) -> ErpOutboundOrderBaseSalesResponse {
    ErpOutboundOrderBaseSalesResponse { 
        id: model.id,
        order_number: model.order_number,
        sale_id: model.sale_id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        outbound_date: model.outbound_date,
        remarks: model.remarks,
        discount_rate: model.discount_rate,
        other_cost: model.other_cost,
        settlement_account_id: model.settlement_account_id,

        details,
        attachments,
    }
}

pub fn model_to_base_other_response(model: ErpOutboundOrder, details: Vec<ErpOutboundOrderDetailBaseOtherResponse>, attachments: Vec<ErpOutboundOrderAttachmentBaseResponse>) -> ErpOutboundOrderBaseOtherResponse {
    ErpOutboundOrderBaseOtherResponse { 
        id: model.id,
        order_number: model.order_number,
        sale_id: model.sale_id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        outbound_date: model.outbound_date,
        remarks: model.remarks,
        discount_rate: model.discount_rate,
        other_cost: model.other_cost,
        settlement_account_id: model.settlement_account_id,

        details,
        attachments,
    }
}

pub fn model_to_info_sales_response(model: ErpOutboundOrder, model_settlement_account: Option<ErpSettlementAccount>, details: Vec<ErpOutboundOrderDetailBaseSalesResponse>, attachments: Vec<ErpOutboundOrderAttachmentBaseResponse>) -> ErpOutboundOrderInfoSalesResponse {
    let settlement_account_name = model_settlement_account.map(|settlement_account| settlement_account.name.clone());

    ErpOutboundOrderInfoSalesResponse { 
        id: model.id,
        order_number: model.order_number,
        sale_id: model.sale_id,
        customer_id: model.customer_id,
        user_id: model.user_id,
        outbound_date: model.outbound_date,
        remarks: model.remarks,
        discount_rate: model.discount_rate,
        other_cost: model.other_cost,
        settlement_account_id: model.settlement_account_id,
        department_code: model.department_code,
        department_id: model.department_id,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,

        details,
        attachments,

        settlement_account_name,
    }
}