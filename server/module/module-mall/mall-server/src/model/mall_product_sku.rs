use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_product_sku")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 主键
    
    pub spu_id: i64, // spu编号
    
    pub properties: Option<String>, // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
    
    pub price: i32, // 商品价格，单位：分
    
    pub market_price: Option<i32>, // 市场价，单位：分
    
    pub cost_price: i32, // 成本价，单位： 分
    
    pub bar_code: Option<String>, // SKU 的条形码
    
    pub file_id: i64, // 图片ID
    
    pub stock: Option<i32>, // 库存
    
    pub weight: Option<f64>, // 商品重量，单位：kg 千克
    
    pub volume: Option<f64>, // 商品体积，单位：m^3 平米
    
    pub first_brokerage_price: Option<i32>, // 一级分销的佣金，单位：分
    
    pub second_brokerage_price: Option<i32>, // 二级分销的佣金，单位：分
    
    pub sales_count: Option<i32>, // 商品销量
    
    pub creator: Option<i64>, // 创建者ID
    
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    pub update_time: NaiveDateTime, // 更新时间
    
    pub deleted: bool, // 是否删除
    
    pub tenant_id: i64, // 租户编号
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<Entity> for Entity {
    fn to() -> RelationDef {
        panic!("No relations defined")
    }
}

impl ActiveFilterEntityTrait for Entity {
    fn active_condition() -> Condition {
        Condition::all().add(Column::Deleted.eq(false))
    }
}

impl ActiveModelBehavior for ActiveModel {}