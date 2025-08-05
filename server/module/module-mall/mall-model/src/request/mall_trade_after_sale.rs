use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeAfterSaleRequest {
    
    pub no: String, // 售后单号
    
    pub r#type: Option<i8>, // 售后类型
    
    pub status: i8, // 售后状态
    
    pub way: i8, // 售后方式
    
    pub user_id: i64, // 用户编号
    
    pub apply_reason: String, // 申请原因
    
    pub apply_description: Option<String>, // 补充描述
    
    pub apply_pic_urls: Option<String>, // 补充凭证图片
    
    pub order_id: i64, // 订单编号
    
    pub order_no: String, // 订单流水号
    
    pub order_item_id: i64, // 订单项编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub spu_name: String, // 商品 SPU 名称
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub properties: Option<String>, // 商品属性数组，JSON 格式
    
    pub pic_url: Option<String>, // 商品图片
    
    pub count: i32, // 购买数量
    
    #[schema(value_type = String, format = Date)]
    pub audit_time: Option<NaiveDateTime>, // 审批时间
    
    pub audit_user_id: Option<i64>, // 审批人
    
    pub audit_reason: Option<String>, // 审批备注
    
    pub refund_price: i32, // 退款金额，单位：分
    
    pub pay_refund_id: Option<i64>, // 支付退款编号
    
    #[schema(value_type = String, format = Date)]
    pub refund_time: Option<NaiveDateTime>, // 退款时间
    
    pub logistics_id: Option<i64>, // 退货物流公司编号
    
    pub logistics_no: Option<String>, // 退货物流单号
    
    #[schema(value_type = String, format = Date)]
    pub delivery_time: Option<NaiveDateTime>, // 退货时间
    
    #[schema(value_type = String, format = Date)]
    pub receive_time: Option<NaiveDateTime>, // 收货时间
    
    pub receive_reason: Option<String>, // 收货备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeAfterSaleRequest {
    
    pub id: i64, // 售后编号
    
    pub no: Option<String>, // 售后单号
    
    pub r#type: Option<i8>, // 售后类型
    
    pub status: Option<i8>, // 售后状态
    
    pub way: Option<i8>, // 售后方式
    
    pub user_id: Option<i64>, // 用户编号
    
    pub apply_reason: Option<String>, // 申请原因
    
    pub apply_description: Option<String>, // 补充描述
    
    pub apply_pic_urls: Option<String>, // 补充凭证图片
    
    pub order_id: Option<i64>, // 订单编号
    
    pub order_no: Option<String>, // 订单流水号
    
    pub order_item_id: Option<i64>, // 订单项编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub spu_name: Option<String>, // 商品 SPU 名称
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub properties: Option<String>, // 商品属性数组，JSON 格式
    
    pub pic_url: Option<String>, // 商品图片
    
    pub count: Option<i32>, // 购买数量
    
    #[schema(value_type = String, format = Date)]
    pub audit_time: Option<NaiveDateTime>, // 审批时间
    
    pub audit_user_id: Option<i64>, // 审批人
    
    pub audit_reason: Option<String>, // 审批备注
    
    pub refund_price: Option<i32>, // 退款金额，单位：分
    
    pub pay_refund_id: Option<i64>, // 支付退款编号
    
    #[schema(value_type = String, format = Date)]
    pub refund_time: Option<NaiveDateTime>, // 退款时间
    
    pub logistics_id: Option<i64>, // 退货物流公司编号
    
    pub logistics_no: Option<String>, // 退货物流单号
    
    #[schema(value_type = String, format = Date)]
    pub delivery_time: Option<NaiveDateTime>, // 退货时间
    
    #[schema(value_type = String, format = Date)]
    pub receive_time: Option<NaiveDateTime>, // 收货时间
    
    pub receive_reason: Option<String>, // 收货备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}