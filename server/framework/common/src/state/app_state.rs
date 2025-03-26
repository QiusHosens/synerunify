use sea_orm::DatabaseConnection;
use uaparser::UserAgentParser;

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub ua_parser: UserAgentParser,
}