use reqwest::{header::{HeaderMap, HeaderValue, AUTHORIZATION}, StatusCode};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Semaphore;
use tokio::time::{sleep, Duration, Instant};

const MENU_LIST_ADDR: &str = "localhost/system/system_menu/list";
const USER_AUTHORIZATION: &str = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZpY2VfdHlwZSI6IndlYiIsInN1YiI6MSwidGVuYW50X2lkIjoxLCJleHAiOjE3NDk2MDQ3NjYsImlhdCI6MTc0OTYwMzg2Nn0.U8jXwVpA9xDFJ0yJbFAPsx_KykC3ENx3Cs4OUWO9LvE";

#[tokio::test]
async fn test_concurrent_requests() {
    // 启动服务器
    let url = format!("http://{}", MENU_LIST_ADDR);
    let client = reqwest::Client::new();

    // 定义并发请求数量
    let concurrent_requests = 50;
    // 使用 Semaphore 控制最大并发量
    let semaphore = Arc::new(Semaphore::new(10)); // 最大 10 个并发
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
            println!("headers {:?}", headers);
            let response = client.get(&url).headers(headers).send().await.unwrap();
            println!("response {:?}", response);

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
async fn test_single_request() {
    // 测试单个请求，确保基本功能正常
    let url = format!("http://{}", MENU_LIST_ADDR);
    let client = reqwest::Client::new();

    // 记录请求时间
    let start = Instant::now();
    let start_time = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f").to_string();

    let response = client.get(&url).send().await.unwrap();

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