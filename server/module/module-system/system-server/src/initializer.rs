use std::future::Future;
use sea_orm::DatabaseConnection;
use tracing::error;
use common::database::redis::RedisManager;
use common::database::redis_constants::REDIS_KEY_TENANTS_LIST;
use common::state::app_state::AppState;
use common::utils::jwt_utils::add_tenants;
use crate::service;
use crate::utils::area_utils::init_area_cache;

/// 初始化执行
pub async fn initialize(state: AppState) {
    initialize_tenant_cache(&state.db.clone()).await;
    initialize_area_cache().await;
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
    add_tenants(tenant_id_list.as_slice());
}

/// 初始化区域缓存
pub async fn initialize_area_cache() {
    match init_area_cache().await {
        Ok(_) => tracing::info!("Area cache initialization successful"),
        Err(e) => {
            error!("Area cache initialization failed: {}", e.to_string());
        }
    }
}