use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpProductResponse {
    
    pub id: i64, // 产品ID
    
    pub product_code: Option<String>, // 产品编码
    
    pub name: String, // 产品名称
    
    pub category_id: Option<i64>, // 产品分类ID
    
    pub unit_id: i64, // 产品单位ID
    
    pub status: i8, // 状态
    
    pub barcode: Option<String>, // 条码
    
    pub specification: Option<String>, // 规格
    
    pub shelf_life_days: Option<i32>, // 保质期天数
    
    pub weight: Option<i32>, // 重量,kg,精确到百分位
    
    pub purchase_price: Option<i64>, // 采购价格
    
    pub sale_price: Option<i64>, // 销售价格
    
    pub min_price: Option<i64>, // 最低价格
    
    pub stock_quantity: i32, // 库存数量
    
    pub min_stock: i32, // 最低库存
    
    pub remarks: Option<String>, // 备注
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}