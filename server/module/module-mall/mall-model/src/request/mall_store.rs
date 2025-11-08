use chrono::NaiveDateTime;


use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallStoreRequest {
    
    pub number: String, // 店铺编号（业务唯一，例：S202410080001）
    
    pub name: String, // 店铺名称
    
    pub short_name: Option<String>, // 店铺简称
    
    pub file_id: i64, // 店铺封面ID
    
    pub slider_file_ids: Option<String>, // 店铺轮播图id数组，以逗号分隔最多上传15张
    
    pub sort: Option<i32>, // 店铺排序
    
    pub slogan: Option<String>, // 店铺广告语
    
    pub description: Option<String>, // 店铺描述
    
    pub tags: Option<String>, // 店铺标签，逗号分隔，如：正品保障,7天无理由
    
    pub status: i8, // 状态:0-待审核,1-营业中,2-暂停营业,3-审核驳回,4-永久关闭
    
    pub audit_remark: Option<String>, // 审核备注
    
    #[schema(value_type = String, format = Date)]
    pub audit_time: Option<NaiveDateTime>, // 审核通过时间
    
    pub score_desc: Option<i32>, // 描述相符评分
    
    pub score_service: Option<i32>, // 服务态度评分
    
    pub score_delivery: Option<i32>, // 发货速度评分
    
    pub total_sales_amount: Option<i32>, // 累计销售额
    
    pub total_order_count: Option<i64>, // 累计订单数
    
    pub total_goods_count: Option<i32>, // 商品总数
    
    pub total_fans_count: Option<i32>, // 粉丝数
    
    pub is_recommend: Option<i8>, // 是否平台推荐：0-否,1-是
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallStoreRequest {
    
    pub id: i64, // 店铺编号
    
    pub number: Option<String>, // 店铺编号（业务唯一，例：S202410080001）
    
    pub name: Option<String>, // 店铺名称
    
    pub short_name: Option<String>, // 店铺简称
    
    pub file_id: Option<i64>, // 店铺封面ID
    
    pub slider_file_ids: Option<String>, // 店铺轮播图id数组，以逗号分隔最多上传15张
    
    pub sort: Option<i32>, // 店铺排序
    
    pub slogan: Option<String>, // 店铺广告语
    
    pub description: Option<String>, // 店铺描述
    
    pub tags: Option<String>, // 店铺标签，逗号分隔，如：正品保障,7天无理由
    
    pub status: Option<i8>, // 状态:0-待审核,1-营业中,2-暂停营业,3-审核驳回,4-永久关闭
    
    pub audit_remark: Option<String>, // 审核备注
    
    #[schema(value_type = String, format = Date)]
    pub audit_time: Option<NaiveDateTime>, // 审核通过时间
    
    pub score_desc: Option<i32>, // 描述相符评分
    
    pub score_service: Option<i32>, // 服务态度评分
    
    pub score_delivery: Option<i32>, // 发货速度评分
    
    pub total_sales_amount: Option<i32>, // 累计销售额
    
    pub total_order_count: Option<i64>, // 累计订单数
    
    pub total_goods_count: Option<i32>, // 商品总数
    
    pub total_fans_count: Option<i32>, // 粉丝数
    
    pub is_recommend: Option<i8>, // 是否平台推荐：0-否,1-是
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}