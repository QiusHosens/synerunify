use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_notice::{self, SystemNotice, SystemNoticeEntity, Column};
use crate::request::system_notice::{CreateSystemNoticeRequest, UpdateSystemNoticeRequest};
use crate::response::system_notice::SystemNoticeResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemNoticeService {
    db: DatabaseConnection 
}

static SYSTEM_NOTICE_SERVICE: OnceCell<Arc<SystemNoticeService>> = OnceCell::const_new();
 
impl SystemNoticeService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemNoticeService> {
        SYSTEM_NOTICE_SERVICE
            .get_or_init(|| async { Arc::new(SystemNoticeService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemNoticeRequest) -> Result<i64> {
        let system_notice = request.to_active_model();
        let system_notice = system_notice.insert(&self.db).await?;
        Ok(system_notice.id)
    }

    pub async fn update(&self, request: UpdateSystemNoticeRequest) -> Result<()> {
        let system_notice = SystemNoticeEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_notice = request.to_active_model(system_notice);
        system_notice.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemNoticeEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemNoticeResponse>> {
        let system_notice = SystemNoticeEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_notice.map(SystemNoticeResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemNoticeEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemNoticeResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemNoticeResponse>> {
        let list = SystemNoticeEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemNoticeResponse::from).collect())
    }
}