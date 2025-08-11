use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_article")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 文章管理编号
    
    pub category_id: i64, // 分类编号
    
    pub spu_id: i64, // 关联商品编号
    
    pub title: String, // 文章标题
    
    pub author: Option<String>, // 文章作者
    
    pub file_id: i64, // 文章封面图片ID
    
    pub introduction: Option<String>, // 文章简介
    
    pub browse_count: Option<String>, // 浏览次数
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态
    
    pub recommend_hot: bool, // 是否热门(小程序)
    
    pub recommend_banner: bool, // 是否轮播图(小程序)
    
    pub content: String, // 文章内容
    
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