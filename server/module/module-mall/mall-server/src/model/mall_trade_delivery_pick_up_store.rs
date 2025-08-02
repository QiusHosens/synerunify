use chrono::NaiveDateTime;
use chrono::NaiveTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_delivery_pick_up_store")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号
    
    pub name: String, // 门店名称
    
    pub introduction: Option<String>, // 门店简介
    
    pub phone: String, // 门店手机
    
    pub area_id: i32, // 区域编号
    
    pub detail_address: String, // 门店详细地址
    
    pub logo: String, // 门店 logo
    
    pub opening_time: NaiveTime, // 营业开始时间
    
    pub closing_time: NaiveTime, // 营业结束时间
    
    pub latitude: f64, // 纬度
    
    pub longitude: f64, // 经度
    
    pub verify_user_ids: Option<String>, // 核销用户编号数组
    
    pub status: i8, // 门店状态
    
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