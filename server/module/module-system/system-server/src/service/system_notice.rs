use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait};
use tokio::sync::OnceCell;
use crate::model::system_notice::{ActiveModel as SystemNoticeEntity, Column};
use system_model::request::system_notice::{CreateSystemNoticeRequest, UpdateSystemNoticeRequest, PaginatedKeywordRequest};
use system_model::response::system_notice::SystemNoticeResponse;
use crate::convert::system_notice::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemNoticeService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_NOTICE_SERVICE: OnceCell<Arc<SystemNoticeService>> = OnceCell::const_new();
 
impl SystemNoticeService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemNoticeService> {
        SYSTEM_NOTICE_SERVICE
            .get_or_init(|| async { Arc::new(SystemNoticeService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemNoticeRequest) -> Result<i64> {
        let system_notice = create_request_to_model(&request);
        let system_notice = system_notice.insert(&*self.db).await?;
        Ok(system_notice.id)
    }

    pub async fn update(&self, request: UpdateSystemNoticeRequest) -> Result<()> {
        let system_notice = SystemNoticeEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_notice = update_request_to_model(&request, system_notice);
        system_notice.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemNoticeEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemNoticeResponse>> {
        let system_notice = SystemNoticeEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_notice.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemNoticeResponse>> {
        let paginator = SystemNoticeEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemNoticeResponse>> {
        let list = SystemNoticeEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}