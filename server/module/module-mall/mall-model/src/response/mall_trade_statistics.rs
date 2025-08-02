use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeStatisticsResponse {
    
    pub id: i64, // 编号，主键自增
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
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
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}