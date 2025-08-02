


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionPointProductRequest {
    
    pub activity_id: i64, // 积分商城活动 id
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub count: i32, // 可兑换次数
    
    pub point: i32, // 所需兑换积分
    
    pub price: i32, // 所需兑换金额，单位：分
    
    pub stock: i32, // 积分商城商品库存
    
    pub activity_status: i32, // 积分商城商品状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionPointProductRequest {
    
    pub id: i64, // 积分商城商品编号
    
    pub activity_id: Option<i64>, // 积分商城活动 id
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub count: Option<i32>, // 可兑换次数
    
    pub point: Option<i32>, // 所需兑换积分
    
    pub price: Option<i32>, // 所需兑换金额，单位：分
    
    pub stock: Option<i32>, // 积分商城商品库存
    
    pub activity_status: Option<i32>, // 积分商城商品状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}