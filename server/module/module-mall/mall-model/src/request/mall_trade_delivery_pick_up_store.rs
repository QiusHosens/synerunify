

use chrono::NaiveTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateMallTradeDeliveryPickUpStoreRequest {
    
    pub name: String, // 门店名称
    
    pub introduction: Option<String>, // 门店简介
    
    pub phone: String, // 门店手机
    
    pub area_id: i32, // 区域编号
    
    pub detail_address: String, // 门店详细地址

    pub file_id: i64, // 门店 logo id
    
    #[schema(value_type = String, format = Date)]
    pub opening_time: NaiveTime, // 营业开始时间
    
    #[schema(value_type = String, format = Date)]
    pub closing_time: NaiveTime, // 营业结束时间
    
    pub latitude: f64, // 纬度
    
    pub longitude: f64, // 经度
    
    pub verify_user_ids: Option<String>, // 核销用户编号数组
    
    pub status: i8, // 门店状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateMallTradeDeliveryPickUpStoreRequest {
    
    pub id: i64, // 编号
    
    pub name: Option<String>, // 门店名称
    
    pub introduction: Option<String>, // 门店简介
    
    pub phone: Option<String>, // 门店手机
    
    pub area_id: Option<i32>, // 区域编号
    
    pub detail_address: Option<String>, // 门店详细地址

    pub file_id: Option<i64>, // 门店 logo id
    
    #[schema(value_type = String, format = Date)]
    pub opening_time: Option<NaiveTime>, // 营业开始时间
    
    #[schema(value_type = String, format = Date)]
    pub closing_time: Option<NaiveTime>, // 营业结束时间
    
    pub latitude: Option<f64>, // 纬度
    
    pub longitude: Option<f64>, // 经度
    
    pub verify_user_ids: Option<String>, // 核销用户编号数组
    
    pub status: Option<i8>, // 门店状态
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}