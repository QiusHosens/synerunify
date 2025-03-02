use std::ptr::null;
use std::sync::Arc;
use axum::handler::HandlerWithoutStateExt;
use axum::http::Method;
use axum::Router;
use tower_http::cors::{Any, CorsLayer};
use common::config::database::{get_database_instance};
use common::config::config::Config;
use once_cell::sync::Lazy;

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
    let config = Config::load()?;
    let database = get_database_instance(config.database_url).await;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(vec![Method::GET, Method::POST])
        .allow_headers(Any);

    // let app = Router::new()
    //     .nest_service(config.api_prefix.as_ref(), route::api(database).await)
    //     .layer(cors);
    let app = route::api(database).await
        .layer(cors);

    let addr = format!("0.0.0.0:{}", config.server_port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    println!("Server running on {}", addr);
    axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()).await?;
    Ok(())
    // let config = Config::load()?;
    //
    // let database = get_database_instance(config.database_url).await;
    //
    // // 跨域
    // let cors = CorsLayer::new()
    //     .allow_origin(Any) // 允许所有来源，可根据需要限制特定域名
    //     .allow_methods(vec![Method::GET, Method::POST]) // 允许所有 HTTP GET/POST 方法
    //     .allow_headers(Any);
    //
    // let app = Router::new().nest_service(config.api_prefix.as_ref(), route::api(database).await);
    //
    // let app = app.layer(cors);
    //
    // let addr = format!("0.0.0.0:{}", config.server_port);
    // let listener = tokio::net::TcpListener::bind(&addr).await?;
    // println!("Server running on {}", addr);
    // axum::serve(listener, app.into_make_service()).await?;
    // Ok(())
}

// fn main() -> Result<(), anyhow::Error> {
//     // 在运行时启动前加载配置
//     let config = Config::load()?;
//
//     RT.block_on(async {
//         let database = get_database_instance(config.database_url).await;
//
//         let cors = CorsLayer::new()
//             .allow_origin(Any)
//             .allow_methods(vec![Method::GET, Method::POST])
//             .allow_headers(Any);
//
//         let app = Router::new()
//             .nest_service(config.api_prefix.as_ref(), route::api(database).await)
//             .layer(cors);
//
//         let addr = format!("0.0.0.0:{}", config.server_port);
//         let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
//         println!("Server running on {}", addr);
//         axum::serve(listener, app.into_make_service()).await.unwrap();
//     });
//
//     Ok(())
// }
