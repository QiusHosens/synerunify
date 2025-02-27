use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_role::{self, SystemRole, SystemRoleEntity, Column};
use crate::request::system_role::{CreateSystemRoleRequest, UpdateSystemRoleRequest};
use crate::response::system_role::SystemRoleResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemRoleService {
    db: DatabaseConnection 
}

static SYSTEM_ROLE_SERVICE: OnceCell<Arc<SystemRoleService>> = OnceCell::const_new();
 
impl SystemRoleService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemRoleService> {
        SYSTEM_ROLE_SERVICE
            .get_or_init(|| async { Arc::new(SystemRoleService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemRoleRequest) -> Result<i64> {
        let system_role = request.to_active_model();
        let system_role = system_role.insert(&self.db).await?;
        Ok(system_role.id)
    }

    pub async fn update(&self, request: UpdateSystemRoleRequest) -> Result<()> {
        let system_role = SystemRoleEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_role = request.to_active_model(system_role);
        system_role.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemRoleEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemRoleResponse>> {
        let system_role = SystemRoleEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_role.map(SystemRoleResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemRoleEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemRoleResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemRoleResponse>> {
        let list = SystemRoleEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemRoleResponse::from).collect())
    }
}