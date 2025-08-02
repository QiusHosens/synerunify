use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallTradeConfigResponse {
    
    pub id: i64, // 自增主键
    
    pub after_sale_refund_reasons: String, // 售后退款理由
    
    pub after_sale_return_reasons: String, // 售后退货理由
    
    pub delivery_express_free_enabled: bool, // 是否启用全场包邮
    
    pub delivery_express_free_price: i32, // 全场包邮的最小金额，单位：分
    
    pub delivery_pick_up_enabled: bool, // 是否开启自提
    
    pub brokerage_enabled: bool, // 是否启用分佣
    
    pub brokerage_enabled_condition: i8, // 分佣模式：1-人人分销 2-指定分销
    
    pub brokerage_bind_mode: i8, // 分销关系绑定模式: 1-没有推广人，2-新用户, 3-扫码覆盖
    
    pub brokerage_poster_urls: Option<String>, // 分销海报图地址数组
    
    pub brokerage_first_percent: i32, // 一级返佣比例
    
    pub brokerage_second_percent: i32, // 二级返佣比例
    
    pub brokerage_withdraw_min_price: i32, // 用户提现最低金额
    
    pub brokerage_withdraw_fee_percent: i32, // 提现手续费百分比
    
    pub brokerage_frozen_days: i32, // 佣金冻结时间(天)
    
    pub brokerage_withdraw_types: String, // 提现方式：1-钱包；2-银行卡；3-微信；4-支付宝
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}