


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;
use crate::request::mall_product_sku::{CreateMallProductSkuRequest, UpdateMallProductSkuRequest};

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallProductSpuRequest {
    
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
    
    pub delivery_types: String, // 配送方式数组
    
    pub delivery_template_id: Option<i64>, // 物流配置模板编号
    
    pub give_integral: i32, // 赠送积分
    
    pub sub_commission_type: Option<i8>, // 分销类型
    
    pub sales_count: Option<i32>, // 商品销量
    
    pub virtual_sales_count: Option<i32>, // 虚拟销量
    
    pub browse_count: Option<i32>, // 商品点击量

    pub skus: Vec<CreateMallProductSkuRequest>, // sku列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallProductSpuRequest {
    
    pub id: i64, // 商品 SPU 编号，自增
    
    pub name: Option<String>, // 商品名称
    
    pub keyword: Option<String>, // 关键字
    
    pub introduction: Option<String>, // 商品简介
    
    pub description: Option<String>, // 商品详情
    
    pub category_id: Option<i64>, // 商品分类编号
    
    pub brand_id: Option<i32>, // 商品品牌编号
    
    pub file_id: Option<i64>, // 商品封面ID
    
    pub slider_file_ids: Option<String>, // 商品轮播图id数组，以逗号分隔最多上传15张
    
    pub sort: Option<i32>, // 排序字段
    
    pub status: Option<i8>, // 商品状态: 0 上架（开启） 1 下架（禁用） -1 回收
    
    pub spec_type: Option<i8>, // 规格类型：0 单规格 1 多规格
    
    pub delivery_types: Option<String>, // 配送方式数组
    
    pub delivery_template_id: Option<i64>, // 物流配置模板编号
    
    pub give_integral: Option<i32>, // 赠送积分
    
    pub sub_commission_type: Option<i8>, // 分销类型
    
    pub sales_count: Option<i32>, // 商品销量
    
    pub virtual_sales_count: Option<i32>, // 虚拟销量
    
    pub browse_count: Option<i32>, // 商品点击量

    pub skus: Vec<UpdateMallProductSkuRequest>, // sku列表
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedCategoryKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub category_id: Option<i64>, // 商品分类编号
    pub keyword: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedTenantKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub tenant_id: Option<i64>, // 租户编号
    pub keyword: Option<String>,
}