use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait, PaginatorTrait, QueryOrder};
use tokio::sync::OnceCell;
use crate::model::system_tenant::{Entity as SystemTenantEntity, Column};
use system_model::request::system_tenant::{CreateSystemTenantRequest, UpdateSystemTenantRequest, PaginatedKeywordRequest};
use system_model::response::system_tenant::SystemTenantResponse;
use crate::convert::system_tenant::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemTenantService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_TENANT_SERVICE: OnceCell<Arc<SystemTenantService>> = OnceCell::const_new();
 
impl SystemTenantService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemTenantService> {
        SYSTEM_TENANT_SERVICE
            .get_or_init(|| async { Arc::new(SystemTenantService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemTenantRequest) -> Result<i64> {
        let system_tenant = create_request_to_model(&request);
        let system_tenant = system_tenant.insert(&*self.db).await?;
        Ok(system_tenant.id)
    }

    pub async fn update(&self, request: UpdateSystemTenantRequest) -> Result<()> {
        let system_tenant = SystemTenantEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_tenant = update_request_to_model(&request, system_tenant);
        system_tenant.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemTenantEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemTenantResponse>> {
        let system_tenant = SystemTenantEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_tenant.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemTenantResponse>> {
        let paginator = SystemTenantEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemTenantResponse>> {
        let list = SystemTenantEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}