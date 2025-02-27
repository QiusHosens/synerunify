use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_post::{self, SystemPost, SystemPostEntity, Column};
use crate::request::system_post::{CreateSystemPostRequest, UpdateSystemPostRequest};
use crate::response::system_post::SystemPostResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemPostService {
    db: DatabaseConnection 
}

static SYSTEM_POST_SERVICE: OnceCell<Arc<SystemPostService>> = OnceCell::const_new();
 
impl SystemPostService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemPostService> {
        SYSTEM_POST_SERVICE
            .get_or_init(|| async { Arc::new(SystemPostService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemPostRequest) -> Result<i64> {
        let system_post = request.to_active_model();
        let system_post = system_post.insert(&self.db).await?;
        Ok(system_post.id)
    }

    pub async fn update(&self, request: UpdateSystemPostRequest) -> Result<()> {
        let system_post = SystemPostEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_post = request.to_active_model(system_post);
        system_post.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemPostEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemPostResponse>> {
        let system_post = SystemPostEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_post.map(SystemPostResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemPostEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemPostResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemPostResponse>> {
        let list = SystemPostEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemPostResponse::from).collect())
    }
}