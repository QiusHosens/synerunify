use std::net::{IpAddr, SocketAddr};
use axum::{
    body::{Body, Bytes},
    extract::{OriginalUri, Request},
    http::StatusCode,
    middleware::Next,
    response::IntoResponse,
};
use anyhow::Result;
use axum::body::to_bytes;
use axum::extract::ConnectInfo;
use axum::http::request::Parts;
use tracing::info;
use crate::config::config::Config;
use crate::context::context::RequestContext;

/// req上下文注入中间件 同时进行jwt授权验证
pub async fn request_context_handler(request: Request, next: Next) -> Result<impl IntoResponse, (StatusCode, String)> {
    // 请求信息request context注入
    let request_url = if let Some(path) = request.extensions().get::<OriginalUri>() {
        path.0.path().to_owned()
    } else {
        request.uri().path().to_owned()
    };
    let method = request.method().to_string();
    let path_params = request.uri().query().unwrap_or("").to_string();

    let (parts, req_body) = request.into_parts();

    let (bytes, body_data) = match get_body_data(req_body).await {
        Err(e) => return Err(e),
        Ok((x, y)) => (x, y),
    };

    // 连接信息
    let ip_addr = get_ip(&parts);
    let ip = ip_addr.map(|ip| ip.to_string()).unwrap_or("Unknown".to_string());
    let user_agent = parts.headers
        .get("User-Agent")
        .and_then(|ua| ua.to_str().ok())
        .unwrap_or("Unknown");

    let request_context = RequestContext {
        request_url,
        path_params,
        method: method.to_string(),
        data: body_data.clone(),
        ip,
        user_agent: user_agent.to_string()
    };
    info!("request context: {:?}", request_context);
    let mut request = Request::from_parts(parts, Body::from(bytes));

    request.extensions_mut().insert(request_context);

    let response = next.run(request).await;
    Ok(response)
}

async fn get_body_data(body: Body) -> Result<(Bytes, String), (StatusCode, String)> {
    // 将 Body 转换为 Bytes
    let bytes = match to_bytes(body, usize::MAX).await {
        Ok(bytes) => bytes,
        Err(err) => {
            return Err((
                StatusCode::BAD_REQUEST,
                format!("failed to read body: {}", err),
            ));
        }
    };

    // 尝试将 bytes 转换为字符串
    match std::str::from_utf8(&bytes) {
        Ok(x) => {
            let res_data = x.to_string();
            Ok((bytes, res_data))
        }
        Err(_) => Ok((
            bytes,
            "该数据无法转输出，可能为blob,binary".to_string(),
        )),
    }
}

fn get_ip(parts: &Parts) -> Option<IpAddr> {
     parts.headers
        .get("X-Forwarded-For")
        .and_then(|value| value.to_str().ok())
        .and_then(|xff| xff.split(',').next())
        .and_then(|ip| ip.trim().parse::<IpAddr>().ok())
        .or_else(|| {
            parts.extensions
                .get::<ConnectInfo<SocketAddr>>()
                .map(|info| info.ip())
        })
}