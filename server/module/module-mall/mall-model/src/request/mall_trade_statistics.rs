use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeStatisticsRequest {
    
    #[schema(value_type = String, format = Date)]
    pub time: NaiveDateTime, // 统计日期
    
    pub order_create_count: i32, // 创建订单数
    
    pub order_pay_count: i32, // 支付订单商品数
    
    pub order_pay_price: i32, // 总支付金额，单位：分
    
    pub after_sale_count: i32, // 退款订单数
    
    pub after_sale_refund_price: i32, // 总退款金额，单位：分
    
    pub brokerage_settlement_price: i32, // 佣金金额（已结算），单位：分
    
    pub wallet_pay_price: i32, // 总支付金额（余额），单位：分
    
    pub recharge_pay_count: i32, // 充值订单数
    
    pub recharge_pay_price: i32, // 充值金额，单位：分
    
    pub recharge_refund_count: i32, // 充值退款订单数
    
    pub recharge_refund_price: i32, // 充值退款金额，单位：分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeStatisticsRequest {
    
    pub id: i64, // 编号，主键自增
    
    #[schema(value_type = String, format = Date)]
    pub time: Option<NaiveDateTime>, // 统计日期
    
    pub order_create_count: Option<i32>, // 创建订单数
    
    pub order_pay_count: Option<i32>, // 支付订单商品数
    
    pub order_pay_price: Option<i32>, // 总支付金额，单位：分
    
    pub after_sale_count: Option<i32>, // 退款订单数
    
    pub after_sale_refund_price: Option<i32>, // 总退款金额，单位：分
    
    pub brokerage_settlement_price: Option<i32>, // 佣金金额（已结算），单位：分
    
    pub wallet_pay_price: Option<i32>, // 总支付金额（余额），单位：分
    
    pub recharge_pay_count: Option<i32>, // 充值订单数
    
    pub recharge_pay_price: Option<i32>, // 充值金额，单位：分
    
    pub recharge_refund_count: Option<i32>, // 充值退款订单数
    
    pub recharge_refund_price: Option<i32>, // 充值退款金额，单位：分
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}