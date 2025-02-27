use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_tenant::{self, SystemTenant, SystemTenantEntity, Column};
use crate::request::system_tenant::{CreateSystemTenantRequest, UpdateSystemTenantRequest};
use crate::response::system_tenant::SystemTenantResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemTenantService {
    db: DatabaseConnection 
}

static SYSTEM_TENANT_SERVICE: OnceCell<Arc<SystemTenantService>> = OnceCell::const_new();
 
impl SystemTenantService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemTenantService> {
        SYSTEM_TENANT_SERVICE
            .get_or_init(|| async { Arc::new(SystemTenantService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemTenantRequest) -> Result<i64> {
        let system_tenant = request.to_active_model();
        let system_tenant = system_tenant.insert(&self.db).await?;
        Ok(system_tenant.id)
    }

    pub async fn update(&self, request: UpdateSystemTenantRequest) -> Result<()> {
        let system_tenant = SystemTenantEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_tenant = request.to_active_model(system_tenant);
        system_tenant.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemTenantEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemTenantResponse>> {
        let system_tenant = SystemTenantEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_tenant.map(SystemTenantResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemTenantEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemTenantResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemTenantResponse>> {
        let list = SystemTenantEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemTenantResponse::from).collect())
    }
}