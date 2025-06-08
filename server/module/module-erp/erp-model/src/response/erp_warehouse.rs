use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

// #[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct ErpWarehouseResponse {
    
    pub id: i64, // 仓库ID
    
    pub warehouse_name: String, // 仓库名称
    
    pub location: Option<String>, // 仓库位置
    
    pub status: i8, // 状态
    
    pub sort_order: i32, // 排序
    
    pub storage_fee: Option<i64>, // 仓储费
    
    pub handling_fee: Option<i64>, // 搬运费
    
    pub manager: Option<String>, // 负责人
    
    pub remarks: Option<String>, // 备注
    
    pub department_code: String, // 部门编码
    
    pub department_id: i64, // 部门ID
    
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