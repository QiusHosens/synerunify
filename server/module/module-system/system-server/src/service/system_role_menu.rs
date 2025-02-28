use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_role_menu::{self, SystemRoleMenu, SystemRoleMenuEntity, Column};
use crate::request::system_role_menu::{CreateSystemRoleMenuRequest, UpdateSystemRoleMenuRequest};
use crate::response::system_role_menu::SystemRoleMenuResponse;
use crate::convert::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemRoleMenuService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_ROLE_MENU_SERVICE: OnceCell<Arc<SystemRoleMenuService>> = OnceCell::const_new();
 
impl SystemRoleMenuService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemRoleMenuService> {
        SYSTEM_ROLE_MENU_SERVICE
            .get_or_init(|| async { Arc::new(SystemRoleMenuService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemRoleMenuRequest) -> Result<i64> {
        let system_role_menu = create_request_to_model(&request);
        let system_role_menu = system_role_menu.insert(&self.db).await?;
        Ok(system_role_menu.id)
    }

    pub async fn update(&self, request: UpdateSystemRoleMenuRequest) -> Result<()> {
        let system_role_menu = SystemRoleMenuEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_role_menu = update_request_to_model(&request, system_role_menu);
        system_role_menu.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemRoleMenuEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemRoleMenuResponse>> {
        let system_role_menu = SystemRoleMenuEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_role_menu.map(model_to_response))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemRoleMenuEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemRoleMenuResponse>> {
        let list = SystemRoleMenuEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}