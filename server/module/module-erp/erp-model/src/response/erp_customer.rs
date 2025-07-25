use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpCustomerResponse {
    
    pub id: i64, // 客户ID
    
    pub name: String, // 客户名称
    
    pub contact_person: Option<String>, // 联系人
    
    pub phone: Option<String>, // 电话
    
    pub email: Option<String>, // 邮箱
    
    pub address: Option<String>, // 地址
    
    pub status: i8, // 状态
    
    pub sort: i32, // 排序
    
    pub tax_id: Option<String>, // 纳税人识别号
    
    pub tax_rate: Option<i32>, // 税率,精确到万分位
    
    pub bank_name: Option<String>, // 开户行
    
    pub bank_account: Option<String>, // 银行账号
    
    pub bank_address: Option<String>, // 开户地址
    
    pub remarks: Option<String>, // 备注
    
    pub creator: Option<i64>, // 创建者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    // #[serde_as(as = "DisplayFromStr")]
    // #[serde(with = "serde_with::chrono::naive_datetime")]
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}