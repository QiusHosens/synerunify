use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use crate::response::mall_product_sku::MallProductSkuBaseResponse;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductSpuResponse {
    
    pub id: i64, // 商品 SPU 编号，自增
    
    pub name: String, // 商品名称
    
    pub keyword: Option<String>, // 关键字
    
    pub introduction: Option<String>, // 商品简介
    
    pub description: Option<String>, // 商品详情
    
    pub category_id: i64, // 商品分类编号
    
    pub brand_id: Option<i32>, // 商品品牌编号
    
    pub file_id: i64, // 商品封面ID
    
    pub slider_file_ids: Option<String>, // 商品轮播图id数组，以逗号分隔最多上传15张
    
    pub sort: i32, // 排序字段
    
    pub status: i8, // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
    
    pub spec_type: Option<i8>, // 规格类型：0 单规格 1 多规格
    
    pub price: i32, // 商品价格，单位使用：分
    
    pub market_price: Option<i32>, // 市场价，单位使用：分
    
    pub cost_price: i32, // 成本价，单位： 分
    
    pub stock: i32, // 库存
    
    pub delivery_types: String, // 配送方式数组
    
    pub delivery_template_id: Option<i64>, // 物流配置模板编号
    
    pub give_integral: i32, // 赠送积分
    
    pub sub_commission_type: Option<i8>, // 分销类型
    
    pub sales_count: Option<i32>, // 商品销量
    
    pub virtual_sales_count: Option<i32>, // 虚拟销量
    
    pub browse_count: Option<i32>, // 商品点击量
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间

    pub tenant_id: i64, // 租户编号
    
}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductSpuPageResponse {

    pub id: i64, // 商品 SPU 编号，自增

    pub name: String, // 商品名称

    pub keyword: Option<String>, // 关键字

    pub introduction: Option<String>, // 商品简介

    pub description: Option<String>, // 商品详情

    pub category_id: i64, // 商品分类编号

    pub brand_id: Option<i32>, // 商品品牌编号

    pub file_id: i64, // 商品封面ID

    pub slider_file_ids: Option<String>, // 商品轮播图id数组，以逗号分隔最多上传15张

    pub sort: i32, // 排序字段

    pub status: i8, // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收

    pub spec_type: Option<i8>, // 规格类型：0 单规格 1 多规格

    pub price: i32, // 商品价格，单位使用：分

    pub market_price: Option<i32>, // 市场价，单位使用：分

    pub cost_price: i32, // 成本价，单位： 分

    pub stock: i32, // 库存

    pub delivery_types: String, // 配送方式数组

    pub delivery_template_id: Option<i64>, // 物流配置模板编号

    pub give_integral: i32, // 赠送积分

    pub sub_commission_type: Option<i8>, // 分销类型

    pub sales_count: Option<i32>, // 商品销量

    pub virtual_sales_count: Option<i32>, // 虚拟销量

    pub browse_count: Option<i32>, // 商品点击量

    pub creator: Option<i64>, // 创建者ID

    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间

    pub updater: Option<i64>, // 更新者ID

    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间

    pub tenant_id: i64, // 租户编号

    /****************** 信息 ******************/

    pub category_name: Option<String>, // 商品分类名称

    pub brand_name: Option<String>, // 商品品牌名称

    pub store_names: Vec<String>, // 店铺名列表

}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductSpuBaseResponse {

    pub id: i64, // 商品 SPU 编号，自增

    pub name: String, // 商品名称

    pub keyword: Option<String>, // 关键字

    pub introduction: Option<String>, // 商品简介

    pub description: Option<String>, // 商品详情

    pub category_id: i64, // 商品分类编号

    pub brand_id: Option<i32>, // 商品品牌编号

    pub file_id: i64, // 商品封面ID

    pub slider_file_ids: Option<String>, // 商品轮播图id数组，以逗号分隔最多上传15张

    pub sort: i32, // 排序字段

    pub status: i8, // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收

    pub spec_type: Option<i8>, // 规格类型：0 单规格 1 多规格

    pub price: i32, // 商品价格，单位使用：分

    pub market_price: Option<i32>, // 市场价，单位使用：分

    pub cost_price: i32, // 成本价，单位： 分

    pub stock: i32, // 库存

    pub delivery_types: String, // 配送方式数组

    pub delivery_template_id: Option<i64>, // 物流配置模板编号

    pub give_integral: i32, // 赠送积分

    pub sub_commission_type: Option<i8>, // 分销类型

    pub sales_count: Option<i32>, // 商品销量

    pub virtual_sales_count: Option<i32>, // 虚拟销量

    pub browse_count: Option<i32>, // 商品点击量

    pub skus: Vec<MallProductSkuBaseResponse>, // sku列表

}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductSpuInfoResponse {

    pub id: i64, // 商品 SPU 编号，自增

    pub name: String, // 商品名称

    pub keyword: Option<String>, // 关键字

    pub introduction: Option<String>, // 商品简介

    pub description: Option<String>, // 商品详情

    pub category_id: i64, // 商品分类编号

    pub brand_id: Option<i32>, // 商品品牌编号

    pub file_id: i64, // 商品封面ID

    pub slider_file_ids: Option<String>, // 商品轮播图id数组，以逗号分隔最多上传15张

    pub sort: i32, // 排序字段

    pub status: i8, // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收

    pub spec_type: Option<i8>, // 规格类型：0 单规格 1 多规格

    pub price: i32, // 商品价格，单位使用：分

    pub market_price: Option<i32>, // 市场价，单位使用：分

    pub cost_price: i32, // 成本价，单位： 分

    pub stock: i32, // 库存

    pub delivery_types: String, // 配送方式数组

    pub delivery_template_id: Option<i64>, // 物流配置模板编号

    pub give_integral: i32, // 赠送积分

    pub sub_commission_type: Option<i8>, // 分销类型

    pub sales_count: Option<i32>, // 商品销量

    pub virtual_sales_count: Option<i32>, // 虚拟销量

    pub browse_count: Option<i32>, // 商品点击量

    pub tenant_id: i64, // 租户编号

    /****************** 信息 ******************/

    pub category_name: Option<String>, // 商品分类名称

    pub brand_name: Option<String>, // 商品品牌名称

    pub delivery_template_name: Option<String>, // 物流配置模板名称

    pub skus: Vec<MallProductSkuBaseResponse>, // sku列表

}

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductSpuStoreResponse {

    pub id: i64, // 商品 SPU 编号，自增

    pub name: String, // 商品名称

    pub keyword: Option<String>, // 关键字

    pub introduction: Option<String>, // 商品简介

    pub description: Option<String>, // 商品详情

    pub category_id: i64, // 商品分类编号

    pub brand_id: Option<i32>, // 商品品牌编号

    pub file_id: i64, // 商品封面ID

    pub slider_file_ids: Option<String>, // 商品轮播图id数组，以逗号分隔最多上传15张

    pub sort: i32, // 排序字段

    pub status: i8, // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收

    pub spec_type: Option<i8>, // 规格类型：0 单规格 1 多规格

    pub price: i32, // 商品价格，单位使用：分

    pub market_price: Option<i32>, // 市场价，单位使用：分

    pub cost_price: i32, // 成本价，单位： 分

    pub stock: i32, // 库存

    pub delivery_types: String, // 配送方式数组

    pub delivery_template_id: Option<i64>, // 物流配置模板编号

    pub give_integral: i32, // 赠送积分

    pub sub_commission_type: Option<i8>, // 分销类型

    pub sales_count: Option<i32>, // 商品销量

    pub virtual_sales_count: Option<i32>, // 虚拟销量

    pub browse_count: Option<i32>, // 商品点击量

    pub creator: Option<i64>, // 创建者ID

    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间

    pub updater: Option<i64>, // 更新者ID

    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间

    pub tenant_id: i64, // 租户编号

    pub store_id: Option<i64>, // 店铺编号

}