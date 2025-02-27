use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_tenant_package::{self, SystemTenantPackage, SystemTenantPackageEntity, Column};
use crate::request::system_tenant_package::{CreateSystemTenantPackageRequest, UpdateSystemTenantPackageRequest};
use crate::response::system_tenant_package::SystemTenantPackageResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemTenantPackageService {
    db: DatabaseConnection 
}

static SYSTEM_TENANT_PACKAGE_SERVICE: OnceCell<Arc<SystemTenantPackageService>> = OnceCell::const_new();
 
impl SystemTenantPackageService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemTenantPackageService> {
        SYSTEM_TENANT_PACKAGE_SERVICE
            .get_or_init(|| async { Arc::new(SystemTenantPackageService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemTenantPackageRequest) -> Result<i64> {
        let system_tenant_package = request.to_active_model();
        let system_tenant_package = system_tenant_package.insert(&self.db).await?;
        Ok(system_tenant_package.id)
    }

    pub async fn update(&self, request: UpdateSystemTenantPackageRequest) -> Result<()> {
        let system_tenant_package = SystemTenantPackageEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_tenant_package = request.to_active_model(system_tenant_package);
        system_tenant_package.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemTenantPackageEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemTenantPackageResponse>> {
        let system_tenant_package = SystemTenantPackageEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_tenant_package.map(SystemTenantPackageResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemTenantPackageEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemTenantPackageResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemTenantPackageResponse>> {
        let list = SystemTenantPackageEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemTenantPackageResponse::from).collect())
    }
}