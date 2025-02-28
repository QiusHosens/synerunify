use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, ActiveModelTrait};
use tokio::sync::OnceCell;
use crate::model::system_user_role::{ActiveModel as SystemUserRoleEntity, Column};
use system_model::request::system_user_role::{CreateSystemUserRoleRequest, UpdateSystemUserRoleRequest, PaginatedKeywordRequest};
use system_model::response::system_user_role::SystemUserRoleResponse;
use crate::convert::system_user_role::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemUserRoleService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_USER_ROLE_SERVICE: OnceCell<Arc<SystemUserRoleService>> = OnceCell::const_new();
 
impl SystemUserRoleService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemUserRoleService> {
        SYSTEM_USER_ROLE_SERVICE
            .get_or_init(|| async { Arc::new(SystemUserRoleService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemUserRoleRequest) -> Result<i64> {
        let system_user_role = create_request_to_model(&request);
        let system_user_role = system_user_role.insert(&*self.db).await?;
        Ok(system_user_role.id)
    }

    pub async fn update(&self, request: UpdateSystemUserRoleRequest) -> Result<()> {
        let system_user_role = SystemUserRoleEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_user_role = update_request_to_model(&request, system_user_role);
        system_user_role.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemUserRoleEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemUserRoleResponse>> {
        let system_user_role = SystemUserRoleEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_user_role.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemUserRoleResponse>> {
        let paginator = SystemUserRoleEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemUserRoleResponse>> {
        let list = SystemUserRoleEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}