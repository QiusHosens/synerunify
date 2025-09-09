use serde::{Serialize, Deserialize};
use serde::de::Error;
use utoipa::ToSchema;

fn from_str<'de, D, S>(deserializer: D) -> Result<S, D::Error>
where D: serde::Deserializer<'de>,
      S: std::str::FromStr
{
    let s = <&str as serde::Deserialize>::deserialize(deserializer)?;
    S::from_str(&s).map_err(|_| D::Error::custom("could not parse string"))
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedRequest {
    #[serde(deserialize_with="from_str")]
    pub page: u64,
    #[serde(deserialize_with="from_str")]
    pub size: u64,
    pub keyword: Option<String>,
    pub sort_field: Option<String>, // 排序字段
    pub sort: Option<String>, // 排序,asc or desc
    pub filter_field: Option<String>, // 过滤字段
    pub filter_operator: Option<String>, // 过滤操作,contain/
    pub filter_value: Option<String>, // 过滤值
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedResponse<T> {
    pub list: Vec<T>,
    pub total_pages: u64,
    pub page: u64,
    pub size: u64,
    pub total: u64,
}

fn de_vec_or_single<'de, D>(deserializer: D) -> Result<Vec<i64>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    #[derive(Deserialize)]
    #[serde(untagged)]
    enum OneOrMany<T> {
        One(T),
        Many(Vec<T>),
    }

    match OneOrMany::deserialize(deserializer)? {
        OneOrMany::One(x) => Ok(vec![x]),
        OneOrMany::Many(xs) => Ok(xs),
    }
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct IdsRequest {
    // #[serde(deserialize_with = "de_vec_or_single")]
    pub ids: Vec<i64>,
}