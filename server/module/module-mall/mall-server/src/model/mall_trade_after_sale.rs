use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_after_sale")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 售后编号
    
    pub no: String, // 售后单号
    
    pub r#type: Option<i8>, // 售后类型
    
    pub status: i8, // 售后状态
    
    pub way: i8, // 售后方式
    
    pub user_id: i64, // 用户编号
    
    pub apply_reason: String, // 申请原因
    
    pub apply_description: Option<String>, // 补充描述
    
    pub apply_pic_urls: Option<String>, // 补充凭证图片
    
    pub order_id: i64, // 订单编号
    
    pub order_no: String, // 订单流水号
    
    pub order_item_id: i64, // 订单项编号
    
    pub spu_id: i64, // 商品 SPU 编号
    
    pub spu_name: String, // 商品 SPU 名称
    
    pub sku_id: i64, // 商品 SKU 编号
    
    pub properties: Option<String>, // 商品属性数组，JSON 格式
    
    pub pic_url: Option<String>, // 商品图片
    
    pub count: i32, // 购买数量
    
    pub audit_time: Option<NaiveDateTime>, // 审批时间
    
    pub audit_user_id: Option<i64>, // 审批人
    
    pub audit_reason: Option<String>, // 审批备注
    
    pub refund_price: i32, // 退款金额，单位：分
    
    pub pay_refund_id: Option<i64>, // 支付退款编号
    
    pub refund_time: Option<NaiveDateTime>, // 退款时间
    
    pub logistics_id: Option<i64>, // 退货物流公司编号
    
    pub logistics_no: Option<String>, // 退货物流单号
    
    pub delivery_time: Option<NaiveDateTime>, // 退货时间
    
    pub receive_time: Option<NaiveDateTime>, // 收货时间
    
    pub receive_reason: Option<String>, // 收货备注
    
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