use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallProductCommentResponse {
    
    pub id: i64, // 评论编号，主键自增
    
    pub user_id: i64, // 评价人的用户编号，关联 MemberUserDO 的 id 编号
    
    pub user_nickname: Option<String>, // 评价人名称
    
    pub user_avatar: Option<String>, // 评价人头像
    
    pub anonymous: bool, // 是否匿名
    
    pub order_id: Option<i64>, // 交易订单编号，关联 TradeOrderDO 的 id 编号
    
    pub order_item_id: Option<i64>, // 交易订单项编号，关联 TradeOrderItemDO 的 id 编号
    
    pub spu_id: i64, // 商品 SPU 编号，关联 ProductSpuDO 的 id
    
    pub spu_name: Option<String>, // 商品 SPU 名称
    
    pub sku_id: i64, // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
    
    pub sku_pic_url: String, // 图片地址
    
    pub sku_properties: Option<String>, // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
    
    pub visible: Option<bool>, // 是否可见，true:显示false:隐藏
    
    pub scores: i8, // 评分星级1-5分
    
    pub description_scores: i8, // 描述星级 1-5 星
    
    pub benefit_scores: i8, // 服务星级 1-5 星
    
    pub content: String, // 评论内容
    
    pub pic_urls: Option<String>, // 评论图片地址数组
    
    pub reply_status: Option<bool>, // 商家是否回复
    
    pub reply_user_id: Option<i64>, // 回复管理员编号，关联 AdminUserDO 的 id 编号
    
    pub reply_content: Option<String>, // 商家回复内容
    
    #[serde_as(as = "Option<common::formatter::string_date_time::StringDateTime>")]
    #[schema(value_type = String, format = Date)]
    pub reply_time: Option<NaiveDateTime>, // 商家回复时间
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}