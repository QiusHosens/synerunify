use chrono::NaiveDateTime;
use macros::ExtendFields;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};
use common::formatter::string_date_time::StringDateTime;

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
// #[derive(Deserialize, ExtendFields, Debug, Clone, ToSchema)]
pub struct ErpWarehouseResponse {
    
    pub id: i64, // 仓库ID
    
    pub name: String, // 仓库名称
    
    pub location: Option<String>, // 仓库位置
    
    pub status: i8, // 状态
    
    pub sort: i32, // 排序
    
    pub storage_fee: Option<i64>, // 仓储费
    
    pub handling_fee: Option<i64>, // 搬运费
    
    pub manager: Option<String>, // 负责人
    
    pub remarks: Option<String>, // 备注
    
    // #[extend_fields(fill_type = "user", invocation = "system_common::service::system::get_user_names_batch")]
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