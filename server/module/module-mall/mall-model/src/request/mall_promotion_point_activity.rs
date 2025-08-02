


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallPromotionPointActivityRequest {
    
    pub spu_id: i64, // 商品 SPU ID
    
    pub status: i8, // 活动状态
    
    pub remark: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
    pub stock: i32, // 积分商城活动库存(剩余库存积分兑换时扣减)
    
    pub total_stock: i32, // 积分商城活动总库存
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallPromotionPointActivityRequest {
    
    pub id: i64, // 积分商城活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU ID
    
    pub status: Option<i8>, // 活动状态
    
    pub remark: Option<String>, // 备注
    
    pub sort: Option<i32>, // 排序
    
    pub stock: Option<i32>, // 积分商城活动库存(剩余库存积分兑换时扣减)
    
    pub total_stock: Option<i32>, // 积分商城活动总库存
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}