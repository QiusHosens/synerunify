use sea_orm::{Set, NotSet};
use crate::model::mall_trade_brokerage_withdraw::{self, Model as MallTradeBrokerageWithdraw, ActiveModel as MallTradeBrokerageWithdrawActiveModel};
use mall_model::request::mall_trade_brokerage_withdraw::{CreateMallTradeBrokerageWithdrawRequest, UpdateMallTradeBrokerageWithdrawRequest};
use mall_model::response::mall_trade_brokerage_withdraw::MallTradeBrokerageWithdrawResponse;

pub fn create_request_to_model(request: &CreateMallTradeBrokerageWithdrawRequest) -> MallTradeBrokerageWithdrawActiveModel {
    MallTradeBrokerageWithdrawActiveModel {
        user_id: Set(request.user_id.clone()),
        price: Set(request.price.clone()),
        fee_price: Set(request.fee_price.clone()),
        total_price: Set(request.total_price.clone()),
        r#type: Set(request.r#type.clone()),
        user_name: request.user_name.as_ref().map_or(NotSet, |user_name| Set(Some(user_name.clone()))),
        user_account: request.user_account.as_ref().map_or(NotSet, |user_account| Set(Some(user_account.clone()))),
        bank_name: request.bank_name.as_ref().map_or(NotSet, |bank_name| Set(Some(bank_name.clone()))),
        bank_address: request.bank_address.as_ref().map_or(NotSet, |bank_address| Set(Some(bank_address.clone()))),
        qr_code_url: request.qr_code_url.as_ref().map_or(NotSet, |qr_code_url| Set(Some(qr_code_url.clone()))),
        status: Set(request.status.clone()),
        audit_reason: request.audit_reason.as_ref().map_or(NotSet, |audit_reason| Set(Some(audit_reason.clone()))),
        audit_time: request.audit_time.as_ref().map_or(NotSet, |audit_time| Set(Some(audit_time.clone()))),
        remark: request.remark.as_ref().map_or(NotSet, |remark| Set(Some(remark.clone()))),
        pay_transfer_id: request.pay_transfer_id.as_ref().map_or(NotSet, |pay_transfer_id| Set(Some(pay_transfer_id.clone()))),
        transfer_channel_code: request.transfer_channel_code.as_ref().map_or(NotSet, |transfer_channel_code| Set(Some(transfer_channel_code.clone()))),
        transfer_time: request.transfer_time.as_ref().map_or(NotSet, |transfer_time| Set(Some(transfer_time.clone()))),
        transfer_error_msg: request.transfer_error_msg.as_ref().map_or(NotSet, |transfer_error_msg| Set(Some(transfer_error_msg.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallTradeBrokerageWithdrawRequest, existing: MallTradeBrokerageWithdraw) -> MallTradeBrokerageWithdrawActiveModel {
    let mut active_model: MallTradeBrokerageWithdrawActiveModel = existing.into();
    if let Some(user_id) = &request.user_id { 
        active_model.user_id = Set(user_id.clone());
    }
    if let Some(price) = &request.price { 
        active_model.price = Set(price.clone());
    }
    if let Some(fee_price) = &request.fee_price { 
        active_model.fee_price = Set(fee_price.clone());
    }
    if let Some(total_price) = &request.total_price { 
        active_model.total_price = Set(total_price.clone());
    }
    if let Some(r#type) = &request.r#type { 
        active_model.r#type = Set(r#type.clone());
    }
    if let Some(user_name) = &request.user_name { 
        active_model.user_name = Set(Some(user_name.clone()));
    }
    if let Some(user_account) = &request.user_account { 
        active_model.user_account = Set(Some(user_account.clone()));
    }
    if let Some(bank_name) = &request.bank_name { 
        active_model.bank_name = Set(Some(bank_name.clone()));
    }
    if let Some(bank_address) = &request.bank_address { 
        active_model.bank_address = Set(Some(bank_address.clone()));
    }
    if let Some(qr_code_url) = &request.qr_code_url { 
        active_model.qr_code_url = Set(Some(qr_code_url.clone()));
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(audit_reason) = &request.audit_reason { 
        active_model.audit_reason = Set(Some(audit_reason.clone()));
    }
    if let Some(audit_time) = &request.audit_time { 
        active_model.audit_time = Set(Some(audit_time.clone()));
    }
    if let Some(remark) = &request.remark { 
        active_model.remark = Set(Some(remark.clone()));
    }
    if let Some(pay_transfer_id) = &request.pay_transfer_id { 
        active_model.pay_transfer_id = Set(Some(pay_transfer_id.clone()));
    }
    if let Some(transfer_channel_code) = &request.transfer_channel_code { 
        active_model.transfer_channel_code = Set(Some(transfer_channel_code.clone()));
    }
    if let Some(transfer_time) = &request.transfer_time { 
        active_model.transfer_time = Set(Some(transfer_time.clone()));
    }
    if let Some(transfer_error_msg) = &request.transfer_error_msg { 
        active_model.transfer_error_msg = Set(Some(transfer_error_msg.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallTradeBrokerageWithdraw) -> MallTradeBrokerageWithdrawResponse {
    MallTradeBrokerageWithdrawResponse { 
        id: model.id,
        user_id: model.user_id,
        price: model.price,
        fee_price: model.fee_price,
        total_price: model.total_price,
        r#type: model.r#type,
        user_name: model.user_name,
        user_account: model.user_account,
        bank_name: model.bank_name,
        bank_address: model.bank_address,
        qr_code_url: model.qr_code_url,
        status: model.status,
        audit_reason: model.audit_reason,
        audit_time: model.audit_time,
        remark: model.remark,
        pay_transfer_id: model.pay_transfer_id,
        transfer_channel_code: model.transfer_channel_code,
        transfer_time: model.transfer_time,
        transfer_error_msg: model.transfer_error_msg,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}