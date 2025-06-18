
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpProductRequest {
    
    pub product_code: Option<String>, // 产品编码
    
    pub name: String, // 产品名称
    
    pub category_id: Option<i64>, // 产品分类ID
    
    pub unit_id: Option<i64>, // 产品单位ID
    
    pub status: i8, // 状态
    
    pub barcode: Option<String>, // 条码
    
    pub specification: Option<String>, // 规格
    
    pub shelf_life_days: Option<i32>, // 保质期天数
    
    pub weight: Option<i32>, // 重量,kg,精确到百分位
    
    pub purchase_price: Option<i64>, // 采购价格
    
    pub sale_price: Option<i64>, // 销售价格
    
    pub min_price: Option<i64>, // 最低价格
    
    pub min_stock: i32, // 最低库存
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpProductRequest {
    
    pub id: i64, // 产品ID
    
    pub product_code: Option<String>, // 产品编码
    
    pub name: Option<String>, // 产品名称
    
    pub category_id: Option<i64>, // 产品分类ID
    
    pub unit_id: Option<i64>, // 产品单位ID
    
    pub status: Option<i8>, // 状态
    
    pub barcode: Option<String>, // 条码
    
    pub specification: Option<String>, // 规格
    
    pub shelf_life_days: Option<i32>, // 保质期天数
    
    pub weight: Option<i32>, // 重量,kg,精确到百分位
    
    pub purchase_price: Option<i64>, // 采购价格
    
    pub sale_price: Option<i64>, // 销售价格
    
    pub min_price: Option<i64>, // 最低价格
    
    pub min_stock: Option<i32>, // 最低库存
    
    pub remarks: Option<String>, // 备注
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}