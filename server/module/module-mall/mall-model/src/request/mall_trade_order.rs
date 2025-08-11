use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeOrderRequest {
    
    pub no: String, // 订单流水号
    
    pub r#type: i32, // 订单类型
    
    pub terminal: i32, // 订单来源终端
    
    pub user_id: i64, // 用户编号
    
    pub user_ip: String, // 用户 IP
    
    pub user_remark: Option<String>, // 用户备注
    
    pub status: i8, // 订单状态
    
    pub product_count: i32, // 购买的商品数量
    
    pub cancel_type: Option<i32>, // 取消类型
    
    pub remark: Option<String>, // 商家备注
    
    pub comment_status: bool, // 是否评价
    
    pub brokerage_user_id: Option<i64>, // 推广人编号
    
    pub pay_order_id: Option<i64>, // 支付订单编号
    
    pub pay_status: bool, // 是否已支付：[0:未支付 1:已经支付过]
    
    #[schema(value_type = String, format = Date)]
    pub pay_time: Option<NaiveDateTime>, // 订单支付时间
    
    pub pay_channel_code: Option<String>, // 支付成功的支付渠道
    
    #[schema(value_type = String, format = Date)]
    pub finish_time: Option<NaiveDateTime>, // 订单完成时间
    
    #[schema(value_type = String, format = Date)]
    pub cancel_time: Option<NaiveDateTime>, // 订单取消时间
    
    pub total_price: i32, // 商品原价（总），单位：分
    
    pub discount_price: i32, // 订单优惠（总），单位：分
    
    pub delivery_price: i32, // 运费金额，单位：分
    
    pub adjust_price: i32, // 订单调价（总），单位：分
    
    pub pay_price: i32, // 应付金额（总），单位：分
    
    pub delivery_type: i8, // 配送类型
    
    pub logistics_id: Option<i64>, // 发货物流公司编号
    
    pub logistics_no: Option<String>, // 物流公司单号
    
    #[schema(value_type = String, format = Date)]
    pub delivery_time: Option<NaiveDateTime>, // 发货时间
    
    #[schema(value_type = String, format = Date)]
    pub receive_time: Option<NaiveDateTime>, // 收货时间
    
    pub receiver_name: String, // 收件人名称
    
    pub receiver_mobile: String, // 收件人手机
    
    pub receiver_area_id: Option<i32>, // 收件人地区编号
    
    pub receiver_detail_address: Option<String>, // 收件人详细地址
    
    pub pick_up_store_id: Option<i64>, // 自提门店编号
    
    pub pick_up_verify_code: Option<String>, // 自提核销码
    
    pub refund_status: i8, // 售后状态
    
    pub refund_price: i32, // 退款金额，单位：分
    
    pub coupon_id: Option<i64>, // 优惠劵编号
    
    pub coupon_price: i32, // 优惠劵减免金额，单位：分
    
    pub use_point: i32, // 使用的积分
    
    pub point_price: i32, // 积分抵扣的金额
    
    pub give_point: i32, // 赠送的积分
    
    pub refund_point: i32, // 退还的使用的积分
    
    pub vip_price: i32, // VIP 减免金额，单位：分
    
    pub give_coupon_template_counts: Option<String>, // 赠送的优惠劵
    
    pub give_coupon_ids: Option<String>, // 赠送的优惠劵编号
    
    pub flash_activity_id: Option<i64>, // 秒杀活动编号
    
    pub bargain_activity_id: Option<i64>, // 砍价活动编号
    
    pub bargain_record_id: Option<i64>, // 砍价记录编号
    
    pub combination_activity_id: Option<i64>, // 拼团活动编号
    
    pub combination_head_id: Option<i64>, // 拼团团长编号
    
    pub combination_record_id: Option<i64>, // 拼团记录编号
    
    pub point_activity_id: Option<i64>, // 积分活动编号
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeOrderRequest {
    
    pub id: i64, // 订单编号
    
    pub no: Option<String>, // 订单流水号
    
    pub r#type: Option<i32>, // 订单类型
    
    pub terminal: Option<i32>, // 订单来源终端
    
    pub user_id: Option<i64>, // 用户编号
    
    pub user_ip: Option<String>, // 用户 IP
    
    pub user_remark: Option<String>, // 用户备注
    
    pub status: Option<i8>, // 订单状态
    
    pub product_count: Option<i32>, // 购买的商品数量
    
    pub cancel_type: Option<i32>, // 取消类型
    
    pub remark: Option<String>, // 商家备注
    
    pub comment_status: Option<bool>, // 是否评价
    
    pub brokerage_user_id: Option<i64>, // 推广人编号
    
    pub pay_order_id: Option<i64>, // 支付订单编号
    
    pub pay_status: Option<bool>, // 是否已支付：[0:未支付 1:已经支付过]
    
    #[schema(value_type = String, format = Date)]
    pub pay_time: Option<NaiveDateTime>, // 订单支付时间
    
    pub pay_channel_code: Option<String>, // 支付成功的支付渠道
    
    #[schema(value_type = String, format = Date)]
    pub finish_time: Option<NaiveDateTime>, // 订单完成时间
    
    #[schema(value_type = String, format = Date)]
    pub cancel_time: Option<NaiveDateTime>, // 订单取消时间
    
    pub total_price: Option<i32>, // 商品原价（总），单位：分
    
    pub discount_price: Option<i32>, // 订单优惠（总），单位：分
    
    pub delivery_price: Option<i32>, // 运费金额，单位：分
    
    pub adjust_price: Option<i32>, // 订单调价（总），单位：分
    
    pub pay_price: Option<i32>, // 应付金额（总），单位：分
    
    pub delivery_type: Option<i8>, // 配送类型
    
    pub logistics_id: Option<i64>, // 发货物流公司编号
    
    pub logistics_no: Option<String>, // 物流公司单号
    
    #[schema(value_type = String, format = Date)]
    pub delivery_time: Option<NaiveDateTime>, // 发货时间
    
    #[schema(value_type = String, format = Date)]
    pub receive_time: Option<NaiveDateTime>, // 收货时间
    
    pub receiver_name: Option<String>, // 收件人名称
    
    pub receiver_mobile: Option<String>, // 收件人手机
    
    pub receiver_area_id: Option<i32>, // 收件人地区编号
    
    pub receiver_detail_address: Option<String>, // 收件人详细地址
    
    pub pick_up_store_id: Option<i64>, // 自提门店编号
    
    pub pick_up_verify_code: Option<String>, // 自提核销码
    
    pub refund_status: Option<i8>, // 售后状态
    
    pub refund_price: Option<i32>, // 退款金额，单位：分
    
    pub coupon_id: Option<i64>, // 优惠劵编号
    
    pub coupon_price: Option<i32>, // 优惠劵减免金额，单位：分
    
    pub use_point: Option<i32>, // 使用的积分
    
    pub point_price: Option<i32>, // 积分抵扣的金额
    
    pub give_point: Option<i32>, // 赠送的积分
    
    pub refund_point: Option<i32>, // 退还的使用的积分
    
    pub vip_price: Option<i32>, // VIP 减免金额，单位：分
    
    pub give_coupon_template_counts: Option<String>, // 赠送的优惠劵
    
    pub give_coupon_ids: Option<String>, // 赠送的优惠劵编号
    
    pub flash_activity_id: Option<i64>, // 秒杀活动编号
    
    pub bargain_activity_id: Option<i64>, // 砍价活动编号
    
    pub bargain_record_id: Option<i64>, // 砍价记录编号
    
    pub combination_activity_id: Option<i64>, // 拼团活动编号
    
    pub combination_head_id: Option<i64>, // 拼团团长编号
    
    pub combination_record_id: Option<i64>, // 拼团记录编号
    
    pub point_activity_id: Option<i64>, // 积分活动编号
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}