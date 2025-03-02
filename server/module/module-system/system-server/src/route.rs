use crate::api::system_data_scope_rule::system_data_scope_rule_route;
use axum::Router;
use sea_orm::DatabaseConnection;
use std::sync::Arc;

pub async fn api(database: Arc<DatabaseConnection>) -> Router {
    Router::new()
        .nest("/system_data_scope_rule", system_data_scope_rule_route(database).await)
}