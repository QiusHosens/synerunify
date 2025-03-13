use axum::handler::HandlerWithoutStateExt;
use axum::http::Method;
use common::config::config::Config;
use common::database::mysql::{get_database_instance, DATABASE_INSTANCE};
use once_cell::sync::Lazy;
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use common::database::mongo::MongoManager;
use common::middleware::logger;
use common::task::task_manager::TaskManager;
use crate::task::logger_task::LoginLoggerTask;
use crate::task::operation_logger::OperationLoggerTask;

mod api;
mod service;
mod convert;
mod route;
mod task;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // 初始化日志
    logger::init_tracing().await?;
    let config = Config::load();

    // 初始化mongo
    MongoManager::init().await?;

    // 初始化任务管理器
    let mut task_manager = TaskManager::new(10);
    task_manager.add_task(LoginLoggerTask { name: "login logger".to_string() }).await;
    task_manager.add_task(OperationLoggerTask { name: "operation logger".to_string() }).await;
    let task_manager_handle = tokio::spawn(async move {
        println!("任务管理器线程启动");
        task_manager.start().await;
        println!("任务管理器线程结束");
    });

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
    let server_future = axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>());

    tokio::select! {
        result = server_future => {
            if let Err(e) = result {
                eprintln!("Web 服务错误: {}", e);
            }
            println!("Web 服务已停止");
        }
        _ = tokio::signal::ctrl_c() => {
            println!("\n收到退出信号，程序关闭");
            task_manager_handle.abort();
            return Ok(());
        }
    }

    task_manager_handle.abort();

    // 组合任务管理器和web服务
    // tokio::select! {
    //     _ = task_manager.start() => {
    //         println!("Task manager unexpected exit");
    //     },
    //     _ = axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()) => {
    //         println!("Web server unexpected exit");
    //     },
    //     _ = tokio::signal::ctrl_c() => {
    //         println!("\nThe program is closed when the exit signal is received");
    //         task_manager.shutdown();
    //         return Ok(());
    //     }
    // }

    // // 启动任务管理器
    // let task_manager_clone = Arc::clone(&task_manager);
    // let task_manager_handle = tokio::spawn(async move {
    //     let mut task_manager = task_manager_clone.lock().await;
    //     task_manager.start().await;
    // });
    //
    // // 启动 web 服务
    // let server_handle = tokio::spawn(async move {
    //     if let Err(e) = axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()).await {
    //         eprintln!("Web server unexpected exit: {}", e);
    //     }
    // });
    //
    // // 等待 Ctrl+C 信号
    // tokio::signal::ctrl_c().await?;
    // println!("\nThe program is closed when the exit signal is received");
    //
    // // 关闭服务
    // {
    //     let task_manager = task_manager.lock().await;
    //     task_manager.shutdown();
    // }
    // task_manager_handle.abort();
    // server_handle.abort();

    Ok(())
}

#[derive(Clone)]
pub struct AppState {

}