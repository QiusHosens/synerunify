
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use common::base::page::PaginatedRequest;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct CreateErpSupplierRequest {
    
    pub name: String, // 供应商名称
    
    pub contact_person: Option<String>, // 联系人
    
    pub phone: Option<String>, // 电话
    
    pub email: Option<String>, // 邮箱
    
    pub address: Option<String>, // 地址
    
    pub status: i8, // 状态
    
    pub tax_id: Option<String>, // 纳税人识别号
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub bank_name: Option<String>, // 开户行
    
    pub bank_account: Option<String>, // 银行账号
    
    pub bank_address: Option<String>, // 开户地址
    
    pub remarks: Option<String>, // 备注
    
    pub sort: i32, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateErpSupplierRequest {
    
    pub id: i64, // 供应商ID
    
    pub name: Option<String>, // 供应商名称
    
    pub contact_person: Option<String>, // 联系人
    
    pub phone: Option<String>, // 电话
    
    pub email: Option<String>, // 邮箱
    
    pub address: Option<String>, // 地址
    
    pub status: Option<i8>, // 状态
    
    pub tax_id: Option<String>, // 纳税人识别号
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub bank_name: Option<String>, // 开户行
    
    pub bank_account: Option<String>, // 银行账号
    
    pub bank_address: Option<String>, // 开户地址
    
    pub remarks: Option<String>, // 备注
    
    pub sort: Option<i32>, // 排序
    
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedKeywordRequest {
    #[serde(flatten)]
    pub base: PaginatedRequest,
    pub keyword: Option<String>,
}