use axum::{routing::get, Router};
use reqwest::{header::{HeaderMap, HeaderValue, AUTHORIZATION}, StatusCode};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Semaphore;
use tokio::time::{sleep, Duration, Instant};
use tokio::runtime::Builder;

const MENU_LIST_ADDR: &str = "localhost/system/system_menu/list";
const USER_AUTHORIZATION: &str = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VfdHlwZSI6IndlYiIsInN1YiI6MSwidGVuYW50X2lkIjoxLCJleHAiOjE3NDk2MDk5NTQsImlhdCI6MTc0OTYwOTA1NH0.I7mlaD_gcYJwU4ZD8JepBk7QvHqWxurzHO2BAfhqhmA";
// const USER_AUTHORIZATION: &str = "Bearer test-token";

// 定义一个简单的 handler，验证 token
async fn hello_handler(headers: axum::http::HeaderMap) -> Result<&'static str, StatusCode> {
    // 检查 Authorization 头部
    if let Some(auth_header) = headers.get("Authorization") {
        if auth_header == USER_AUTHORIZATION {
            // 模拟一些异步工作
            sleep(Duration::from_millis(100)).await;
            Ok("Hello, World!")
        } else {
            Err(StatusCode::UNAUTHORIZED)
        }
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}

// 创建 Axum 服务器
// async fn start_server() -> SocketAddr {
//     let app = Router::new().route("/", get(hello_handler));
//     let addr = SocketAddr::from(([127, 0, 0, 1], 0)); // 随机分配端口
//     let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
//     let local_addr = listener.local_addr().unwrap();

//     // 在后台启动服务器
//     tokio::spawn(async move {
//         axum::serve(listener, app).await.unwrap();
//     });

//     local_addr
// }

// 创建 Axum 服务器，指定线程数
async fn start_server() -> SocketAddr {
    // 创建独立的 Tokio 运行时
    let rt = Builder::new_multi_thread()
        .worker_threads(10) // 设置 10 个工作线程
        .enable_all() // 启用所有功能（I/O、时间等）
        .build()
        .unwrap();

    let app = Router::new().route("/", get(hello_handler));
    let addr = SocketAddr::from(([127, 0, 0, 1], 0));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    let local_addr = listener.local_addr().unwrap();

    // 打印运行时的线程数
    println!("Server worker threads: {}", rt.metrics().num_workers());

    // 在独立运行时中启动服务器
    rt.spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });

    // 等待服务器启动
    sleep(Duration::from_millis(100)).await;

    local_addr
}

#[tokio::test]
async fn test_concurrent_requests() {
    // 启动服务器
    let url = format!("http://{}", MENU_LIST_ADDR);
    // let addr = start_server().await;
    // let url = format!("http://{}", addr);
    let client = reqwest::Client::new();

    // 定义并发请求数量
    let concurrent_requests = 50;
    // 使用 Semaphore 控制最大并发量
    let semaphore = Arc::new(Semaphore::new(50)); // 最大 10 个并发
    let mut handles = vec![];

    // 创建并发请求
    for i in 0..concurrent_requests {
        let client = client.clone();
        let url = url.clone();
        let sem = Arc::clone(&semaphore);

        let handle = tokio::spawn(async move {
            // 记录请求开始时间
            let start = Instant::now();
            // 获取当前时间戳（格式化输出）
            let start_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();

            // 设置请求头
            let mut headers = HeaderMap::new();
            headers.insert(AUTHORIZATION, HeaderValue::from_static(USER_AUTHORIZATION));

            // 获取信号量许可
            let _permit = sem.acquire().await.unwrap();
            // println!("headers {:?}", headers);
            let response = client.get(&url).headers(headers).send().await.unwrap();
            // println!("response {:?}", response);

            // 记录请求结束时间和耗时
            let end = Instant::now();
            let end_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();
            let duration = end.duration_since(start);

            // 返回结果
            (
                i,
                response,
                start_time,
                end_time,
                duration,
            )
        });
        handles.push(handle);
    }

    // 收集所有响应
    let mut success_count = 0;
    let mut failed_count = 0;
    let mut good_count = 0;

    for handle in handles {
        let (req_id, response, start_time, end_time, duration) = handle.await.unwrap();

        // 打印请求时间信息
        println!(
            "Request {}: Start: {}, End: {}, Duration: {:.2}ms",
            req_id,
            start_time,
            end_time,
            duration.as_secs_f64() * 1000.0 // 转换为毫秒
        );

        if (duration.as_secs_f64() * 1000.0 < 1000.0) {
            good_count += 1;
        }

        if response.status() == StatusCode::OK {
            let body = response.text().await.unwrap();
            // assert_eq!(body, "Hello, World!", "Request {} failed: wrong body", req_id);
            success_count += 1;
        } else {
            println!("Request {} failed with status: {}", req_id, response.status());
            failed_count += 1;
        }
    }

    // 打印总结
    println!(
        "Test completed: {} successful, {} failed, {} is good",
        success_count, failed_count, good_count
    );

    // 验证所有请求都成功
    assert_eq!(
        success_count, concurrent_requests,
        "Not all requests succeeded"
    );
    assert_eq!(failed_count, 0, "Some requests failed");
}

#[tokio::test]
async fn test_single_request() {
    // 测试单个请求，确保基本功能正常
    let url = format!("http://{}", MENU_LIST_ADDR);
    let client = reqwest::Client::new();

    // 记录请求时间
    let start = Instant::now();
    let start_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();

    // 设置请求头
    let mut headers = HeaderMap::new();
    headers.insert(AUTHORIZATION, HeaderValue::from_static(USER_AUTHORIZATION));

    let response = client.get(&url).headers(headers).send().await.unwrap();

    let end = Instant::now();
    let end_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();
    let duration = end.duration_since(start);

    // 打印时间信息
    println!(
        "Single Request: Start: {}, End: {}, Duration: {:.2}ms",
        start_time,
        end_time,
        duration.as_secs_f64() * 1000.0
    );

    assert_eq!(response.status(), StatusCode::OK);
    let body = response.text().await.unwrap();
    // assert_eq!(body, "Hello, World!");
}