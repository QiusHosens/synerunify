use sea_orm::DatabaseConnection;
use uaparser::UserAgentParser;

use crate::utils::minio_utils::MinioClient;

#[derive(Clone, Debug)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub minio: Option<MinioClient>,
    pub ua_parser: Option<UserAgentParser>,
}