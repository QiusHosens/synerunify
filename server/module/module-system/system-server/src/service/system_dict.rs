use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_dict::{self, SystemDict, SystemDictEntity, Column};
use crate::request::system_dict::{CreateSystemDictRequest, UpdateSystemDictRequest};
use crate::response::system_dict::SystemDictResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemDictService {
    db: DatabaseConnection 
}

static SYSTEM_DICT_SERVICE: OnceCell<Arc<SystemDictService>> = OnceCell::const_new();
 
impl SystemDictService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemDictService> {
        SYSTEM_DICT_SERVICE
            .get_or_init(|| async { Arc::new(SystemDictService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemDictRequest) -> Result<i64> {
        let system_dict = request.to_active_model();
        let system_dict = system_dict.insert(&self.db).await?;
        Ok(system_dict.id)
    }

    pub async fn update(&self, request: UpdateSystemDictRequest) -> Result<()> {
        let system_dict = SystemDictEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_dict = request.to_active_model(system_dict);
        system_dict.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemDictEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemDictResponse>> {
        let system_dict = SystemDictEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_dict.map(SystemDictResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemDictEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemDictResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemDictResponse>> {
        let list = SystemDictEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemDictResponse::from).collect())
    }
}