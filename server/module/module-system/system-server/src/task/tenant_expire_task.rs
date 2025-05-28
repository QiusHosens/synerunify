use std::error::Error;
use utoipa::gen::serde_json;
use common::{state::app_state::AppState, task::task_manager::{ErrorAction, Task}};
use crate::service::{self, system_tenant};

// 租户过期任务
pub struct TenantExpireTask {
    pub name: String,
    pub state: AppState,
}

impl TenantExpireTask {
    pub fn new(state: AppState) -> Self {
        TenantExpireTask { name: "tenant expire".to_string(), state }
    }
}

impl Task for TenantExpireTask {
    fn execute(&self) -> Result<(), Box<dyn Error + Send + Sync>> {
        tracing::info!("execute task {}: {:?}", self.name, chrono::Local::now());

        let db = self.state.db.clone();
        let task_name = self.name.clone();
        
        tokio::spawn(async move {
            // 检查并禁用租户
            match system_tenant::check_expire_tenant(&db).await {
                Ok(affected_ids) => {
                    tracing::info!("{} task result: {:?}", task_name, affected_ids);
                }
                Err(e) => {
                    tracing::error!("{} task failed: {:?}", task_name, e);
                }
            }
        });
        Ok(())
    }

    fn on_error(&self, error: Box<dyn Error + Send + Sync>) -> ErrorAction {
        tracing::error!("execute task {} error: {}", self.name, error);
        ErrorAction::Continue
    }
}