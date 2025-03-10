use axum::{
    body::{Body, Bytes},
    extract::{OriginalUri, Request},
    http::StatusCode,
    middleware::Next,
    response::IntoResponse,
};
use axum::body::to_bytes;
use crate::config::config::Config;
use crate::context::context::RequestContext;

/// req上下文注入中间件 同时进行jwt授权验证
pub async fn ctx_fn_mid(req: Request, next: Next) -> Result<impl IntoResponse, (StatusCode, String)> {
    let config = Config::load();
    // 请求信息ctx注入
    let ori_uri_path = if let Some(path) = req.extensions().get::<OriginalUri>() {
        path.0.path().to_owned()
    } else {
        req.uri().path().to_owned()
    };
    let path = ori_uri_path.replacen(&(config.api_prefix.clone() + "/"), "", 1);
    let method = req.method().to_string();
    let path_params = req.uri().query().unwrap_or("").to_string();

    let (parts, req_body) = req.into_parts();

    let (bytes, body_data) = match get_body_data(req_body).await {
        Err(e) => return Err(e),
        Ok((x, y)) => (x, y),
    };

    let req_ctx = RequestContext {
        original_uri: if path_params.is_empty() { ori_uri_path } else { ori_uri_path + "?" + &path_params },
        path,
        path_params,
        method: method.to_string(),
        data: body_data.clone(),
    };

    let mut req = Request::from_parts(parts, Body::from(bytes));

    req.extensions_mut().insert(req_ctx);

    let res = next.run(req).await;
    Ok(res)
}

//  获取body数据
// async fn get_body_data<B>(body: B) -> Result<(Bytes, String), (StatusCode, String)>
// where
//     B: axum::body::HttpBody<Data = Bytes>,
//     B::Error: std::fmt::Display,
// {
//     let bytes = match body.collect().await {
//         Ok(collected) => collected.to_bytes(),
//         Err(err) => {
//             return Err((StatusCode::BAD_REQUEST, format!("failed to read body: {}", err)));
//         }
//     };
//
//     match std::str::from_utf8(&bytes) {
//         Ok(x) => {
//             let res_data = x.to_string();
//             Ok((bytes, res_data))
//         }
//         Err(_) => Ok((bytes, "该数据无法转输出，可能为blob，binary".to_string())),
//     }
// }

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
            "该数据无法转输出，可能为blob，binary".to_string(),
        )),
    }
}