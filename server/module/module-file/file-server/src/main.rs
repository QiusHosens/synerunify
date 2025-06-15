use axum::handler::HandlerWithoutStateExt;
use axum::http::Method;
use common::config::config::Config;
use common::database::mysql::{get_database_instance, DATABASE_INSTANCE};
use common::utils::minio_utils::MinioClient;
use once_cell::sync::Lazy;
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use uaparser::UserAgentParser;
use common::middleware::logger;
use common::state::app_state::AppState;

mod api;
mod route;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // 初始化日志
    logger::init_tracing().await?;
    let config = Config::load();
    let database = get_database_instance(config.database_url).await;

    let minio = MinioClient::new(&config.minio_url, &config.minio_access_key, &config.minio_secret_key).await?;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_headers(Any);

    // let ua_parser = UserAgentParser::from_yaml("regexes.yaml").expect("Failed to load regexes.yaml");

    let state = AppState { db: database.clone(), ua_parser: None, minio: Some(minio) };

    let app = route::api(state).await
        .layer(cors)
        .layer(axum::middleware::from_fn(logger::panic_handler)); // 添加异常处理中间件

    let addr = format!("0.0.0.0:{}", config.file_server_port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    info!("Server running on {}", addr);
    let server_future = axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>());

    tokio::select! {
        result = server_future => {
            if let Err(e) = result {
                eprintln!("Web server unexpected exit: {}", e);
            }
            println!("Web server has stopped");
        }
        // _ = tokio::signal::ctrl_c() => {
        //     println!("The program is closed when the exit signal is received");
        //     task_manager.shutdown();
        //     return Ok(());
        // }
    }

    // task_manager.shutdown();

    Ok(())
}