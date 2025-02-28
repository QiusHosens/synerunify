use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_role_menu_data_scope::{self, SystemRoleMenuDataScope, SystemRoleMenuDataScopeEntity, Column};
use crate::request::system_role_menu_data_scope::{CreateSystemRoleMenuDataScopeRequest, UpdateSystemRoleMenuDataScopeRequest};
use crate::response::system_role_menu_data_scope::SystemRoleMenuDataScopeResponse;
use crate::convert::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemRoleMenuDataScopeService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_ROLE_MENU_DATA_SCOPE_SERVICE: OnceCell<Arc<SystemRoleMenuDataScopeService>> = OnceCell::const_new();
 
impl SystemRoleMenuDataScopeService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemRoleMenuDataScopeService> {
        SYSTEM_ROLE_MENU_DATA_SCOPE_SERVICE
            .get_or_init(|| async { Arc::new(SystemRoleMenuDataScopeService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemRoleMenuDataScopeRequest) -> Result<i64> {
        let system_role_menu_data_scope = create_request_to_model(&request);
        let system_role_menu_data_scope = system_role_menu_data_scope.insert(&self.db).await?;
        Ok(system_role_menu_data_scope.id)
    }

    pub async fn update(&self, request: UpdateSystemRoleMenuDataScopeRequest) -> Result<()> {
        let system_role_menu_data_scope = SystemRoleMenuDataScopeEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_role_menu_data_scope = update_request_to_model(&request, system_role_menu_data_scope);
        system_role_menu_data_scope.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemRoleMenuDataScopeEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemRoleMenuDataScopeResponse>> {
        let system_role_menu_data_scope = SystemRoleMenuDataScopeEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_role_menu_data_scope.map(model_to_response))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemRoleMenuDataScopeEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(model_to_response)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn list(&self) -> Result<Vec<SystemRoleMenuDataScopeResponse>> {
        let list = SystemRoleMenuDataScopeEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}