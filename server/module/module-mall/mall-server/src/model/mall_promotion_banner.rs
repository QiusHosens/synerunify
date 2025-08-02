use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_banner")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // Banner 编号
    
    pub title: String, // Banner 标题
    
    pub pic_url: String, // 图片 URL
    
    pub url: String, // 跳转地址
    
    pub status: i8, // 状态
    
    pub sort: Option<i32>, // 排序
    
    pub position: i8, // 位置
    
    pub memo: Option<String>, // 描述
    
    pub browse_count: Option<i32>, // Banner 点击次数
    
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