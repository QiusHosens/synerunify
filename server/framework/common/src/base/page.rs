use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct PaginatedResponse<T> {
    pub list: Vec<T>,
    pub total_pages: u64,
    pub page: u64,
    pub size: u64,
    pub total: u64,
}