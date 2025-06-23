
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSalesReturnDetailRequest {
    
    pub sale_detail_id: i64, // 销售订单详情ID
    
    pub warehouse_id: i64, // 仓库ID
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSalesReturnDetailRequest {
    
    pub id: Option<i64>, // 退货详情ID,修改有,新增无
    
    pub sale_detail_id: Option<i64>, // 销售订单详情ID
    
    pub warehouse_id: Option<i64>, // 仓库ID
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}