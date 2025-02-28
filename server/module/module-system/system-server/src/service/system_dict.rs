use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait};
use tokio::sync::OnceCell;
use crate::model::system_dict::{ActiveModel as SystemDictEntity, Column};
use system_model::request::system_dict::{CreateSystemDictRequest, UpdateSystemDictRequest, PaginatedKeywordRequest};
use system_model::response::system_dict::SystemDictResponse;
use crate::convert::system_dict::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemDictService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_DICT_SERVICE: OnceCell<Arc<SystemDictService>> = OnceCell::const_new();
 
impl SystemDictService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemDictService> {
        SYSTEM_DICT_SERVICE
            .get_or_init(|| async { Arc::new(SystemDictService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemDictRequest) -> Result<i64> {
        let system_dict = create_request_to_model(&request);
        let system_dict = system_dict.insert(&*self.db).await?;
        Ok(system_dict.id)
    }

    pub async fn update(&self, request: UpdateSystemDictRequest) -> Result<()> {
        let system_dict = SystemDictEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_dict = update_request_to_model(&request, system_dict);
        system_dict.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemDictEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemDictResponse>> {
        let system_dict = SystemDictEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_dict.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDictResponse>> {
        let paginator = SystemDictEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemDictResponse>> {
        let list = SystemDictEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}