use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_promotion_combination_record")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号
    
    pub activity_id: Option<i64>, // 拼团活动编号
    
    pub spu_id: Option<i64>, // 商品 SPU 编号
    
    pub pic_url: String, // 商品图片
    
    pub spu_name: String, // 商品名称
    
    pub sku_id: Option<i64>, // 商品 SKU 编号
    
    pub count: Option<i32>, // 购买的商品数量
    
    pub user_id: Option<i64>, // 用户编号
    
    pub nickname: Option<String>, // 用户昵称
    
    pub avatar: Option<String>, // 用户头像
    
    pub head_id: Option<i64>, // 团长编号
    
    pub order_id: Option<i64>, // 订单编号
    
    pub user_size: i32, // 可参团人数
    
    pub user_count: i32, // 已参团人数
    
    pub virtual_group: Option<bool>, // 是否虚拟拼团
    
    pub status: i8, // 参与状态：1进行中 2已完成 3未完成
    
    pub combination_price: i32, // 拼团商品单价，单位分
    
    pub expire_time: NaiveDateTime, // 过期时间
    
    pub start_time: Option<NaiveDateTime>, // 开始时间 (订单付款后开始的时间)
    
    pub end_time: Option<NaiveDateTime>, // 结束时间（成团时间/失败时间）
    
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