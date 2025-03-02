use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait, PaginatorTrait, QueryOrder};
use tokio::sync::OnceCell;
use crate::model::system_data_scope_rule::{Entity as SystemDataScopeRuleEntity, Column};
use system_model::request::system_data_scope_rule::{CreateSystemDataScopeRuleRequest, UpdateSystemDataScopeRuleRequest, PaginatedKeywordRequest};
use system_model::response::system_data_scope_rule::SystemDataScopeRuleResponse;
use crate::convert::system_data_scope_rule::{create_request_to_model, update_request_to_model, model_to_response};
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemDataScopeRuleService {
    db: Arc<DatabaseConnection>
}

static SYSTEM_DATA_SCOPE_RULE_SERVICE: OnceCell<Arc<SystemDataScopeRuleService>> = OnceCell::const_new();
 
impl SystemDataScopeRuleService {
    pub async fn get_instance(db: Arc<DatabaseConnection>) -> Arc<SystemDataScopeRuleService> {
        SYSTEM_DATA_SCOPE_RULE_SERVICE
            .get_or_init(|| async { Arc::new(SystemDataScopeRuleService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemDataScopeRuleRequest) -> Result<i64> {
        let system_data_scope_rule = create_request_to_model(&request);
        let system_data_scope_rule = system_data_scope_rule.insert(&*self.db).await?;
        Ok(system_data_scope_rule.id)
    }

    pub async fn update(&self, request: UpdateSystemDataScopeRuleRequest) -> Result<()> {
        let system_data_scope_rule = SystemDataScopeRuleEntity::find_by_id(request.id)
            .one(&*self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_data_scope_rule = update_request_to_model(&request, system_data_scope_rule);
        system_data_scope_rule.update(&*self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemDataScopeRuleEntity::delete_by_id(id).exec(&*self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemDataScopeRuleResponse>> {
        let system_data_scope_rule = SystemDataScopeRuleEntity::find_by_id(id).one(&*self.db).await?;
        Ok(system_data_scope_rule.map(model_to_response))
    }

    pub async fn get_paginated(&self, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDataScopeRuleResponse>> {
        let paginator = SystemDataScopeRuleEntity::find()
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

    pub async fn list(&self) -> Result<Vec<SystemDataScopeRuleResponse>> {
        let list = SystemDataScopeRuleEntity::find().all(&*self.db).await?;
        Ok(list.into_iter().map(model_to_response).collect())
    }
}