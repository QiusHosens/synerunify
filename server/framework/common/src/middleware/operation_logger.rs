use std::future::Future;
use std::time::{Duration, Instant};
use axum::extract::Request;
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::Response;
use chrono::Utc;
use anyhow::Result;
use crate::base::logger::OperationLogger;
use crate::base::model::CommonResultJsonString;
use crate::context::context::{LoginUserContext, RequestContext};
use crate::database::redis::RedisManager;
use crate::database::redis_constants::REDIS_KEY_LOGGER_OPERATION_PREFIX;

pub async fn operation_logger_handler(request: Request, next: Next) -> Result<Response, StatusCode> {
    let request_context = match request.extensions().get::<RequestContext>() {
        Some(x) => x.clone(),
        None => return Ok(next.run(request).await),
    };
    let login_user = request.extensions().get::<LoginUserContext>().cloned();

    let now = Instant::now();
    let request_end = next.run(request).await;
    let duration = now.elapsed();
    let result_string = match request_end.extensions().get::<CommonResultJsonString>() {
        Some(x) => x.0.clone(),
        None => "".to_string(),
    };
    // 记录操作日志,异步
    add_logger(request_context, login_user, result_string, duration);
    Ok(request_end)
}

async fn add_logger(request_context: RequestContext, login_user: Option<LoginUserContext>, result: String, duration: Duration) {
    tokio::spawn(async move {
        match add_logger_redis(request_context, login_user, result, duration).await {
            Ok(_) => {}
            Err(e) => {
                tracing::info!("add operation log error: {}", e.to_string());
            }
        }
    });
}

async fn add_logger_redis(request_context: RequestContext, login_user: Option<LoginUserContext>, result: String, duration: Duration) -> Result<()> {
    let user_id = match login_user.clone() {
        None => {None}
        Some(user) => Option::from({ user.id })
    };
    let tenant_id = match login_user.clone() {
        None => {None}
        Some(user) => Option::from({ user.tenant_id })
    };
    // TODO
    let operation_logger = OperationLogger {
        id: None,
        trace_id: "".to_string(),
        user_id,
        user_type: None,
        r#type: "".to_string(),
        sub_type: "".to_string(),
        biz_id: 0,
        action: "".to_string(),
        success: true,
        result,
        extra: "".to_string(),
        request_method: request_context.method,
        request_url: request_context.original_uri,
        user_ip: "".to_string(),
        user_agent: "".to_string(),
        department_code: None,
        department_id: None,
        operator: user_id,
        operator_nickname: None,
        operate_time: Utc::now().timestamp(),
        deleted: false,
        tenant_id
    };

    RedisManager::push_list::<_, String>(REDIS_KEY_LOGGER_OPERATION_PREFIX, serde_json::to_string(&operation_logger)?)?;
    Ok(())
}