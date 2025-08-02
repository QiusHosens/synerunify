use chrono::NaiveDateTime;
use sea_orm::Condition;
use sea_orm::entity::prelude::*;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "mall_trade_brokerage_withdraw")]
pub struct Model {
    
    #[sea_orm(primary_key)]
    pub id: i64, // 编号
    
    pub user_id: i64, // 用户编号
    
    pub price: i32, // 提现金额
    
    pub fee_price: i32, // 提现手续费
    
    pub total_price: i32, // 当前总佣金
    
    pub r#type: i8, // 提现类型
    
    pub user_name: Option<String>, // 真实姓名
    
    pub user_account: Option<String>, // 账号
    
    pub bank_name: Option<String>, // 银行名称
    
    pub bank_address: Option<String>, // 开户地址
    
    pub qr_code_url: Option<String>, // 收款码
    
    pub status: i8, // 状态：0-审核中，10-审核通过 20-审核不通过；11 - 提现成功；21-提现失败
    
    pub audit_reason: Option<String>, // 审核驳回原因
    
    pub audit_time: Option<NaiveDateTime>, // 审核时间
    
    pub remark: Option<String>, // 备注
    
    pub pay_transfer_id: Option<i64>, // 转账订单编号
    
    pub transfer_channel_code: Option<String>, // 转账渠道
    
    pub transfer_time: Option<NaiveDateTime>, // 转账支付时间
    
    pub transfer_error_msg: Option<String>, // 转账错误提示
    
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