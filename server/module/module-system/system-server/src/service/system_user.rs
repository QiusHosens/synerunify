use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_user::{self, SystemUser, SystemUserEntity, Column};
use crate::request::system_user::{CreateSystemUserRequest, UpdateSystemUserRequest};
use crate::response::system_user::SystemUserResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemUserService {
    db: DatabaseConnection 
}

static SYSTEM_USER_SERVICE: OnceCell<Arc<SystemUserService>> = OnceCell::const_new();
 
impl SystemUserService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemUserService> {
        SYSTEM_USER_SERVICE
            .get_or_init(|| async { Arc::new(SystemUserService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemUserRequest) -> Result<i64> {
        let system_user = request.to_active_model();
        let system_user = system_user.insert(&self.db).await?;
        Ok(system_user.id)
    }

    pub async fn update(&self, request: UpdateSystemUserRequest) -> Result<()> {
        let system_user = SystemUserEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_user = request.to_active_model(system_user);
        system_user.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemUserEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemUserResponse>> {
        let system_user = SystemUserEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_user.map(SystemUserResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemUserEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemUserResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemUserResponse>> {
        let list = SystemUserEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemUserResponse::from).collect())
    }
}