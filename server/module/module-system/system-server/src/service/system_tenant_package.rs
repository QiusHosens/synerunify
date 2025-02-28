use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait};
use tokio::sync::OnceCell;
use crate::model::system_tenant_package::{ActiveModel as SystemTenantPackageEntity, Column};
use system_model::request::system_tenant_package::{CreateSystemTenantPackageRequest, UpdateSystemTenantPackageRequest, PaginatedKeywordRequest};
use system_model::response::system_tenant_package::SystemTenantPackageResponse;
use crate::convert::system_tenant_package::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemTenantPackageService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_TENANT_PACKAGE_SERVICE: OnceCell<Arc<SystemTenantPackageService>> = OnceCell::const_new();
 
impl SystemTenantPackageService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemTenantPackageService> {
        SYSTEM_TENANT_PACKAGE_SERVICE
            .get_or_init(|| async { Arc::new(SystemTenantPackageService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemTenantPackageRequest) -> Result<i64> {
        let system_tenant_package = create_request_to_model(&request);
        let system_tenant_package = system_tenant_package.insert(&*self.db).await?;
        Ok(system_tenant_package.id)
    }

    pub async fn update(&self, request: UpdateSystemTenantPackageRequest) -> Result<()> {
        let system_tenant_package = SystemTenantPackageEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_tenant_package = update_request_to_model(&request, system_tenant_package);
        system_tenant_package.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemTenantPackageEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemTenantPackageResponse>> {
        let system_tenant_package = SystemTenantPackageEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_tenant_package.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemTenantPackageResponse>> {
        let paginator = SystemTenantPackageEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&*self.db, params.base.size);
        
        let total = paginator.num_items().await?;
        let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
        let list = paginator
            .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(model_to_response)
            .collect();

        Ok(PaginatedResponse {
            list,
            total_pages,
            page: params.base.page,
            size: params.base.size,
            total,
        })
    }

    pub async fn list(&self) -> Result<Vec<SystemTenantPackageResponse>> {
        let list = SystemTenantPackageEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}