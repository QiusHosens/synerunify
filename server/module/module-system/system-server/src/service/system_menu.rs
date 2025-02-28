use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait};
use tokio::sync::OnceCell;
use crate::model::system_menu::{ActiveModel as SystemMenuEntity, Column};
use system_model::request::system_menu::{CreateSystemMenuRequest, UpdateSystemMenuRequest, PaginatedKeywordRequest};
use system_model::response::system_menu::SystemMenuResponse;
use crate::convert::system_menu::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemMenuService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_MENU_SERVICE: OnceCell<Arc<SystemMenuService>> = OnceCell::const_new();
 
impl SystemMenuService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemMenuService> {
        SYSTEM_MENU_SERVICE
            .get_or_init(|| async { Arc::new(SystemMenuService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemMenuRequest) -> Result<i64> {
        let system_menu = create_request_to_model(&request);
        let system_menu = system_menu.insert(&*self.db).await?;
        Ok(system_menu.id)
    }

    pub async fn update(&self, request: UpdateSystemMenuRequest) -> Result<()> {
        let system_menu = SystemMenuEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_menu = update_request_to_model(&request, system_menu);
        system_menu.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemMenuEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemMenuResponse>> {
        let system_menu = SystemMenuEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_menu.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemMenuResponse>> {
        let paginator = SystemMenuEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemMenuResponse>> {
        let list = SystemMenuEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}