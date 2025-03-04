use axum::handler::HandlerWithoutStateExt;
use axum::http::Method;
use common::config::config::Config;
use common::config::database::get_database_instance;
use once_cell::sync::Lazy;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use middleware::logger::init_tracing;

mod api;
mod service;
mod convert;
mod model;
mod route;

pub static RT: Lazy<Arc<tokio::runtime::Runtime>> = Lazy::new(|| {
    let rt = tokio::runtime::Runtime::new().unwrap();
    Arc::new(rt)
});

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    init_tracing().await?;
    let config = Config::load().await;
    let database = get_database_instance(config.database_url).await;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_headers(Any);

    // let app = Router::new()
    //     .fallback_service(config.api_prefix.as_ref(), route::api(database).await)
    //     .layer(cors);
    let app = route::api(database).await
        .layer(cors);

    let addr = format!("0.0.0.0:{}", config.server_port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    println!("Server running on {}", addr);
    axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()).await?;
    Ok(())
}