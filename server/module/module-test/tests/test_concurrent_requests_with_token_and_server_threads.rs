use axum::{
    routing::get,
    Router,
};
use reqwest::{header::{HeaderMap, HeaderValue, AUTHORIZATION}, StatusCode};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Semaphore;
use tokio::time::{sleep, Duration, Instant};

// 定义一个简单的 handler，验证 token
async fn hello_handler(headers: axum::http::HeaderMap) -> Result<&'static str, StatusCode> {
    // 检查 Authorization 头部
    if let Some(auth_header) = headers.get("Authorization") {
        if auth_header == "Bearer test-token" {
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
async fn start_server() -> SocketAddr {
    let app = Router::new().route("/", get(hello_handler));
    let addr = SocketAddr::from(([127, 0, 0, 1], 0)); // 随机分配端口
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    let local_addr = listener.local_addr().unwrap();

    // 在后台启动服务器
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });

    local_addr
}

#[tokio::test]
async fn test_concurrent_requests_with_token() {
    // 启动服务器
    let addr = start_server().await;
    let url = format!("http://{}", addr);
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
            let start_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();

            // 设置请求头
            let mut headers = HeaderMap::new();
            headers.insert(AUTHORIZATION, HeaderValue::from_static("Bearer test-token"));

            // 获取信号量许可
            let _permit = sem.acquire().await.unwrap();
            let response = client
                .get(&url)
                .headers(headers)
                .send()
                .await
                .unwrap();

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

        if response.status() == StatusCode::OK {
            let body = response.text().await.unwrap();
            assert_eq!(body, "Hello, World!", "Request {} failed: wrong body", req_id);
            success_count += 1;
        } else {
            println!("Request {} failed with status: {}", req_id, response.status());
            failed_count += 1;
        }
    }

    // 打印总结
    println!(
        "Test completed: {} successful, {} failed",
        success_count, failed_count
    );

    // 验证所有请求都成功
    assert_eq!(
        success_count, concurrent_requests,
        "Not all requests succeeded"
    );
    assert_eq!(failed_count, 0, "Some requests failed");
}

#[tokio::test]
async fn test_single_request_with_token() {
    // 测试单个请求，确保基本功能正常
    let addr = start_server().await;
    let url = format!("http://{}", addr);
    let client = reqwest::Client::new();

    // 记录请求时间
    let start = Instant::now();
    let start_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();

    // 设置请求头
    let mut headers = HeaderMap::new();
    headers.insert(AUTHORIZATION, HeaderValue::from_static("Bearer test-token"));

    let response = client
        .get(&url)
        .headers(headers)
        .send()
        .await
        .unwrap();

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
    assert_eq!(body, "Hello, World!");
}