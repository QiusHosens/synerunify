use std::future::Future;
use sea_orm::DatabaseConnection;
use tracing::error;
use common::database::redis::RedisManager;
use common::database::redis_constants::REDIS_KEY_TENANTS_LIST;
use crate::{service, AppState};

/// 初始化执行
pub async fn initialize(state: AppState) {
    initialize_tenant_cache(&state.db.clone()).await
}

/// 初始化租户缓存
pub async fn initialize_tenant_cache(db: &DatabaseConnection) {
    let list = service::system_tenant::list_all(db).await;
    let tenant_id_list: Vec<i64> = match list {
        Ok(tenants) =>
            tenants.into_iter().map(|t| t.id).collect(),
        Err(e) => {
            error!("initialize tenant cache error, {}", e.to_string());
            Vec::new()
        }
    };
    if let Err(e) = RedisManager::add_to_set(REDIS_KEY_TENANTS_LIST, tenant_id_list) {
        error!("cache tenant id error: {}", e.to_string());
    };
}