use sea_orm::DatabaseConnection;
use uaparser::UserAgentParser;

#[derive(Clone, Debug)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub ua_parser: Option<UserAgentParser>,
}