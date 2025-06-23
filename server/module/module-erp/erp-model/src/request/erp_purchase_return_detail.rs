
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpPurchaseReturnDetailRequest {
    
    pub purchase_detail_id: i64, // 采购订单详情ID
    
    pub warehouse_id: i64, // 仓库ID

    pub quantity: i32, // 数量
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpPurchaseReturnDetailRequest {
    
    pub id: Option<i64>, // 退货详情ID,修改有,新增无
    
    pub purchase_detail_id: i64, // 采购订单详情ID
    
    pub warehouse_id: i64, // 仓库ID

    pub quantity: i32, // 数量
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}