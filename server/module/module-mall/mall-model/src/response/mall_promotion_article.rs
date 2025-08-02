use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use utoipa::ToSchema;
use serde_with::{serde_as, DisplayFromStr};

#[serde_as]
#[derive(Deserialize, Serialize, Debug, Clone, ToSchema)]
pub struct MallPromotionArticleResponse {
    
    pub id: i64, // 文章管理编号
    
    pub category_id: i64, // 分类编号
    
    pub spu_id: i64, // 关联商品编号
    
    pub title: String, // 文章标题
    
    pub author: Option<String>, // 文章作者
    
    pub pic_url: String, // 文章封面图片地址
    
    pub introduction: Option<String>, // 文章简介
    
    pub browse_count: Option<String>, // 浏览次数
    
    pub sort: i32, // 排序
    
    pub status: i8, // 状态
    
    pub recommend_hot: bool, // 是否热门(小程序)
    
    pub recommend_banner: bool, // 是否轮播图(小程序)
    
    pub content: String, // 文章内容
    
    pub creator: Option<i64>, // 创建者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub create_time: NaiveDateTime, // 创建时间
    
    pub updater: Option<i64>, // 更新者ID
    
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    #[schema(value_type = String, format = Date)]
    pub update_time: NaiveDateTime, // 更新时间
    
}