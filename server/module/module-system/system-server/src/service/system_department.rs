use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_department::{self, SystemDepartment, SystemDepartmentEntity, Column};
use crate::request::system_department::{CreateSystemDepartmentRequest, UpdateSystemDepartmentRequest};
use crate::response::system_department::SystemDepartmentResponse;
use crate::convert::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemDepartmentService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_DEPARTMENT_SERVICE: OnceCell<Arc<SystemDepartmentService>> = OnceCell::const_new();
 
impl SystemDepartmentService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemDepartmentService> {
        SYSTEM_DEPARTMENT_SERVICE
            .get_or_init(|| async { Arc::new(SystemDepartmentService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemDepartmentRequest) -> Result<i64> {
        let system_department = create_request_to_model(&request);
        let system_department = system_department.insert(&self.db).await?;
        Ok(system_department.id)
    }

    pub async fn update(&self, request: UpdateSystemDepartmentRequest) -> Result<()> {
        let system_department = SystemDepartmentEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_department = update_request_to_model(&request, system_department);
        system_department.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemDepartmentEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemDepartmentResponse>> {
        let system_department = SystemDepartmentEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_department.map(model_to_response))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemDepartmentEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(model_to_response)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn list(&self) -> Result<Vec<SystemDepartmentResponse>> {
        let list = SystemDepartmentEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}