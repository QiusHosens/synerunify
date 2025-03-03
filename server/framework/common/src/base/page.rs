use serde::{Serialize, Deserialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedRequest {
    pub page: u64,
    pub size: u64,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct PaginatedResponse<T> {
    pub list: Vec<T>,
    pub total_pages: u64,
    pub page: u64,
    pub size: u64,
    pub total: u64,
}