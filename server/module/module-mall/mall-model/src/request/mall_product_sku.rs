


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductSkuRequest {
    
    pub spu_id: i64, // spu编号
    
    pub properties: Option<String>, // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
    
    pub price: i32, // 商品价格，单位：分
    
    pub market_price: Option<i32>, // 市场价，单位：分
    
    pub cost_price: i32, // 成本价，单位： 分
    
    pub bar_code: Option<String>, // SKU 的条形码
    
    pub file_id: i64, // 图片ID
    
    pub stock: Option<i32>, // 库存
    
    pub weight: Option<f64>, // 商品重量，单位：kg 千克
    
    pub volume: Option<f64>, // 商品体积，单位：m^3 平米
    
    pub first_brokerage_price: Option<i32>, // 一级分销的佣金，单位：分
    
    pub second_brokerage_price: Option<i32>, // 二级分销的佣金，单位：分
    
    pub sales_count: Option<i32>, // 商品销量
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductSkuRequest {
    
    pub id: i64, // 主键
    
    pub spu_id: Option<i64>, // spu编号
    
    pub properties: Option<String>, // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
    
    pub price: Option<i32>, // 商品价格，单位：分
    
    pub market_price: Option<i32>, // 市场价，单位：分
    
    pub cost_price: Option<i32>, // 成本价，单位： 分
    
    pub bar_code: Option<String>, // SKU 的条形码
    
    pub file_id: Option<i64>, // 图片ID
    
    pub stock: Option<i32>, // 库存
    
    pub weight: Option<f64>, // 商品重量，单位：kg 千克
    
    pub volume: Option<f64>, // 商品体积，单位：m^3 平米
    
    pub first_brokerage_price: Option<i32>, // 一级分销的佣金，单位：分
    
    pub second_brokerage_price: Option<i32>, // 二级分销的佣金，单位：分
    
    pub sales_count: Option<i32>, // 商品销量
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}