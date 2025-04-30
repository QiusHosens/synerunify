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
    pub field: Option<String>,
    pub sort: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedResponse<T> {
    pub list: Vec<T>,
    pub total_pages: u64,
    pub page: u64,
    pub size: u64,
    pub total: u64,
}