use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionCouponResponse {
    
    pub id: i64, // 优惠劵编号
    
    pub template_id: i64, // 优惠劵模板编号
    
    pub name: String, // 优惠劵名
    
    pub status: i8, // 优惠码状态     *     * 1-未使用     * 2-已使用     * 3-已失效
    
    pub user_id: i64, // 用户编号
    
    pub take_type: i8, // 领取类型     *     * 1 - 用户主动领取     * 2 - 后台自动发放
    
    pub use_price: i32, // 是否设置满多少金额可用，单位：分
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub valid_start_time: NaiveDateTime, // 生效开始时间
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub valid_end_time: NaiveDateTime, // 生效结束时间
    
    pub product_scope: i8, // 商品范围
    
    pub product_scope_values: Option<String>, // 商品范围编号的数组
    
    pub discount_type: i8, // 折扣类型
    
    pub discount_percent: Option<i8>, // 折扣百分比
    
    pub discount_price: Option<i32>, // 优惠金额，单位：分
    
    pub discount_limit_price: Option<i32>, // 折扣上限
    
    pub use_order_id: Option<i64>, // 使用订单号
    
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub use_time: Option<NaiveDateTime>, // 使用时间
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}