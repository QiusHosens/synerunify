use axum::handler::HandlerWithoutStateExt;
use axum::http::Method;
use common::config::config::Config;
use common::database::mysql::{get_database_instance, DATABASE_INSTANCE};
use common::task::task_manager::TaskManager;
use once_cell::sync::Lazy;
use task::tenant_expire_task::TenantExpireTask;
use std::sync::Arc;
use sea_orm::DatabaseConnection;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use uaparser::UserAgentParser;
use common::middleware::logger;
use common::state::app_state::AppState;
use crate::initializer::initialize;

mod api;
mod service;
mod convert;
mod model;
mod task;
mod route;
mod initializer;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // 初始化日志
    logger::init_tracing().await?;
    let config = Config::load();
    let database = get_database_instance(config.database_url).await;

    let ua_parser = UserAgentParser::from_yaml("regexes.yaml").expect("Failed to load regexes.yaml");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_headers(Any);

    let state = AppState { db: database.clone(), ua_parser };

    // 执行初始化
    initialize(state.clone()).await;

    // 初始化任务管理器
    let mut task_manager = TaskManager::new();
    // 每天00:05执行
    task_manager.add_task(TenantExpireTask::new(state.clone()), "0 5 0 * * *").await;

    let app = route::api(state).await
        .layer(cors)
        .layer(axum::middleware::from_fn(logger::panic_handler)) // 添加异常处理中间件
        ;

    let addr = format!("0.0.0.0:{}", config.system_server_port);
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
        _ = tokio::signal::ctrl_c() => {
            println!("The program is closed when the exit signal is received");
            task_manager.shutdown();
            return Ok(());
        }
    }

    task_manager.shutdown();

    Ok(())
}