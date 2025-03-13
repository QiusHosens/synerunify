use std::error::Error;
use utoipa::gen::serde_json;
use common::base::logger::LoginLogger;
use common::database::redis::RedisManager;
use common::database::redis_constants::REDIS_KEY_LOGGER_LOGIN_PREFIX;
use common::task::task_manager::Task;
use crate::service;

// 登录日志任务
pub struct LoginLoggerTask {
    pub name: String,
}

impl Task for LoginLoggerTask {
    fn execute(&self) -> Result<(), Box<dyn Error>> {
        tracing::info!("execute login logger task {}: {:?}", self.name, chrono::Local::now());
        // 保存登录日志
        let logs = RedisManager::lpop_all::<_, String>(REDIS_KEY_LOGGER_LOGIN_PREFIX)?;
        if logs.is_empty() {
            tracing::info!("login logger is empty");
            return Ok(())
        }
        let mut login_loggers = Vec::new();
        for log in logs {
            let login_logger = serde_json::from_str::<LoginLogger>(&log)?;
            login_loggers.push(login_logger);
        }
        tokio::spawn(async move {
            match service::login_logger::add_batch(login_loggers).await {
                Ok(_) => {}
                Err(e) => {
                    tracing::info!("save login logger error: {}", e.to_string());
                }
            }
        });
        Ok(())
    }
}