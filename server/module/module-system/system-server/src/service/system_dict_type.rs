use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait, PaginatorTrait, QueryOrder};
use tokio::sync::OnceCell;
use crate::model::system_dict_type::{Entity as SystemDictTypeEntity, Column};
use system_model::request::system_dict_type::{CreateSystemDictTypeRequest, UpdateSystemDictTypeRequest, PaginatedKeywordRequest};
use system_model::response::system_dict_type::SystemDictTypeResponse;
use crate::convert::system_dict_type::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemDictTypeService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_DICT_TYPE_SERVICE: OnceCell<Arc<SystemDictTypeService>> = OnceCell::const_new();
 
impl SystemDictTypeService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemDictTypeService> {
        SYSTEM_DICT_TYPE_SERVICE
            .get_or_init(|| async { Arc::new(SystemDictTypeService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemDictTypeRequest) -> Result<i64> {
        let system_dict_type = create_request_to_model(&request);
        let system_dict_type = system_dict_type.insert(&*self.db).await?;
        Ok(system_dict_type.id)
    }

    pub async fn update(&self, request: UpdateSystemDictTypeRequest) -> Result<()> {
        let system_dict_type = SystemDictTypeEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_dict_type = update_request_to_model(&request, system_dict_type);
        system_dict_type.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemDictTypeEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemDictTypeResponse>> {
        let system_dict_type = SystemDictTypeEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_dict_type.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDictTypeResponse>> {
        let paginator = SystemDictTypeEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemDictTypeResponse>> {
        let list = SystemDictTypeEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}