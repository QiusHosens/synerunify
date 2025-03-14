use std::error::Error;
use utoipa::gen::serde_json;
use common::base::logger::OperationLogger;
use common::database::redis::RedisManager;
use common::database::redis_constants::REDIS_KEY_LOGGER_OPERATION_PREFIX;
use common::task::task_manager::{ErrorAction, Task};
use crate::service;

// 操作日志任务
pub struct OperationLoggerTask {
    pub name: String,
}

impl OperationLoggerTask {
    pub fn new() -> Self {
        OperationLoggerTask { name: "operation logger".to_string() }
    }
}

impl Task for OperationLoggerTask {
    fn execute(&self) -> Result<(), Box<dyn Error + Send + Sync>> {
        tracing::info!("execute operation logger task {}: {:?}", self.name, chrono::Local::now());
        // 保存登录日志
        let logs = RedisManager::lpop_all::<_, String>(REDIS_KEY_LOGGER_OPERATION_PREFIX)?;
        if logs.is_empty() {
            tracing::info!("operation logger is empty");
            return Ok(())
        }
        let mut operation_loggers = Vec::new();
        for log in logs {
            let operation_logger = serde_json::from_str::<OperationLogger>(&log)?;
            operation_loggers.push(operation_logger);
        }
        tokio::spawn(async move {
            match service::operation_logger::add_batch(operation_loggers).await {
                Ok(_) => {}
                Err(e) => {
                    tracing::info!("save operation logger error: {}", e.to_string());
                }
            }
        });
        Ok(())
    }

    fn on_error(&self, error: Box<dyn Error + Send + Sync>) -> ErrorAction {
        println!("execute operation logger task error: {}", error);
        ErrorAction::Continue
    }
}