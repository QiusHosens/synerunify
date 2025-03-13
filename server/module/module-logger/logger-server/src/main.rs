use axum::handler::HandlerWithoutStateExt;
use axum::http::Method;
use common::config::config::Config;
use common::database::mysql::{get_database_instance, DATABASE_INSTANCE};
use once_cell::sync::Lazy;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use common::database::mongo::MongoManager;
use common::middleware::logger;

mod api;
mod service;
mod convert;
mod route;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // 初始化日志
    logger::init_tracing().await?;
    let config = Config::load();

    // 初始化mongo
    MongoManager::init().await?;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_headers(Any);

    let state = AppState { };

    // let app = Router::new()
    //     .fallback_service(config.api_prefix.as_ref(), route::api(database).await)
    //     .layer(cors);
    let app = route::api(state).await
        .layer(cors)
        .layer(axum::middleware::from_fn(logger::panic_handler)); // 添加异常处理中间件

    let addr = format!("0.0.0.0:{}", config.server_port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    info!("Server running on {}", addr);
    axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()).await?;
    Ok(())
}

#[derive(Clone)]
pub struct AppState {

}