use axum::http::Method;
use tower_http::cors::{Any, CorsLayer};
use common::config::config::Config;
use common::config::database::get_database_instance;

mod api;
mod service;
mod convert;
mod model;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let config = Config::load()?;

    let db = get_database_instance(&config).await?;
    let user_service = service::user::UserService::get_instance(db).await;

    let app = user_routes(user_service)
        .layer(
            CorsLayer::new()
                .allow_origin(Any) // 允许所有来源，可根据需要限制特定域名
                .allow_methods(vec![Method::GET, Method::POST]) // 允许所有 HTTP GET/POST 方法
                .allow_headers(Any) // 允许所有请求头
        );

    let addr = format!("0.0.0.0:{}", config.server_port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    println!("Server running on {} (env: {})", addr, config.app_env);
    axum::serve(listener, app).await?;
    Ok(())
}
