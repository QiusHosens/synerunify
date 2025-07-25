
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpWarehouseRequest {
    
    pub name: String, // 仓库名称
    
    pub location: Option<String>, // 仓库位置
    
    pub status: i8, // 状态
    
    pub sort: i32, // 排序
    
    pub storage_fee: Option<i64>, // 仓储费
    
    pub handling_fee: Option<i64>, // 搬运费
    
    pub manager: Option<String>, // 负责人
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpWarehouseRequest {
    
    pub id: i64, // 仓库ID
    
    pub name: Option<String>, // 仓库名称
    
    pub location: Option<String>, // 仓库位置
    
    pub status: Option<i8>, // 状态
    
    pub sort: Option<i32>, // 排序
    
    pub storage_fee: Option<i64>, // 仓储费
    
    pub handling_fee: Option<i64>, // 搬运费
    
    pub manager: Option<String>, // 负责人
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}