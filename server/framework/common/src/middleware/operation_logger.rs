use std::future::Future;
use std::time::{Duration, Instant};
use axum::extract::Request;
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::Response;
use chrono::Utc;
use anyhow::Result;
use tracing::info;
use crate::base::logger::OperationLogger;
use crate::base::response::CommonResultJsonString;
use crate::context::context::{LoginUserContext, RequestContext};
use crate::database::redis::RedisManager;
use crate::database::redis_constants::REDIS_KEY_LOGGER_OPERATION_PREFIX;
use crate::utils::snowflake_generator::SnowflakeGenerator;

pub async fn operation_logger_handler(request: Request, next: Next) -> Result<Response, StatusCode> {
    let start = Instant::now();
    let request_context = match request.extensions().get::<RequestContext>() {
        Some(x) => x.clone(),
        None => return Ok(next.run(request).await),
    };
    let login_user = request.extensions().get::<LoginUserContext>().cloned();

    info!("operation logger time1: {:?}ms", Instant::now().duration_since(start).as_secs_f64() * 1000.0);
    let now = Instant::now();
    let request_end = next.run(request).await;
    let duration = now.elapsed();
    info!("operation logger time2: {:?}ms", Instant::now().duration_since(start).as_secs_f64() * 1000.0);
    let result_string = match request_end.extensions().get::<CommonResultJsonString>() {
        Some(x) => x.0.clone(),
        None => "".to_string(),
    };
    // 记录操作日志,异步
    add_logger(request_context, login_user, result_string, duration);
    info!("operation logger time3: {:?}ms", Instant::now().duration_since(start).as_secs_f64() * 1000.0);
    Ok(request_end)
}

fn add_logger(request_context: RequestContext, login_user: Option<LoginUserContext>, result: String, duration: Duration) {
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
    info!("login user, {:?}", login_user.clone());
    let user_id = login_user.clone().map(|u| u.id);
    let user_nickname = login_user.clone().map(|u| u.nickname);
    let tenant_id = login_user.clone().map(|u| u.tenant_id);
    let department_code = login_user.clone().map(|u| u.department_code);
    let department_id = login_user.clone().map(|u| u.department_id);
    // TODO
    let mut operation_logger = OperationLogger {
        id: None,
        trace_id: None,
        user_id,
        user_type: None,
        r#type: None,
        sub_type: None,
        biz_id: None,
        action: None,
        success: Some(true),
        result,
        extra: None,
        request_method: request_context.method,
        request_url: request_context.request_url,
        user_ip: request_context.ip,
        user_agent: request_context.user_agent,
        department_code,
        department_id,
        duration: Some(duration.as_millis() as i64),
        operator: user_id,
        operator_nickname: user_nickname,
        operate_time: Some(Utc::now().timestamp()),
        deleted: Some(false),
        tenant_id
    };
    // 生成id
    let generator = SnowflakeGenerator::new_with_machine_id(1000).unwrap();
    match generator.generate() {
        Ok(id) => operation_logger.id = Some(id),
        Err(e) => operation_logger.id = None
    }
    // info!("operation logger: {:?}", operation_logger);
    RedisManager::push_list::<_, String>(REDIS_KEY_LOGGER_OPERATION_PREFIX, serde_json::to_string(&operation_logger)?)?;
    Ok(())
}