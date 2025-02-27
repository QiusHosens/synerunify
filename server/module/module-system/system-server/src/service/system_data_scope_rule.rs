use std::sync::Arc;
use sea_orm::{DatabaseConnection, EntityTrait, Set, ActiveModelTrait, QueryFilter, ColumnTrait};
use tokio::sync::OnceCell;
use crate::model::system_data_scope_rule::{self, SystemDataScopeRule, SystemDataScopeRuleEntity, Column};
use crate::request::system_data_scope_rule::{CreateSystemDataScopeRuleRequest, UpdateSystemDataScopeRuleRequest};
use crate::response::system_data_scope_rule::SystemDataScopeRuleResponse;
use anyhow::{Result, anyhow};
use common::base::page::PaginatedResponse;
 
#[derive(Debug)]
pub struct SystemDataScopeRuleService {
    db: DatabaseConnection 
}

static SYSTEM_DATA_SCOPE_RULE_SERVICE: OnceCell<Arc<SystemDataScopeRuleService>> = OnceCell::const_new();
 
impl SystemDataScopeRuleService {
    pub async fn get_instance(db: DatabaseConnection) -> Arc<SystemDataScopeRuleService> {
        SYSTEM_DATA_SCOPE_RULE_SERVICE
            .get_or_init(|| async { Arc::new(SystemDataScopeRuleService { db }) })
            .await
            .clone()
    }

    pub async fn create(&self, request: CreateSystemDataScopeRuleRequest) -> Result<i64> {
        let system_data_scope_rule = request.to_active_model();
        let system_data_scope_rule = system_data_scope_rule.insert(&self.db).await?;
        Ok(system_data_scope_rule.id)
    }

    pub async fn update(&self, request: UpdateSystemDataScopeRuleRequest) -> Result<()> {
        let system_data_scope_rule = SystemDataScopeRuleEntity::find_by_id(request.id)
            .one(&self.db)
            .await?
            .ok_or_else(|| anyhow!("记录未找到"))?;

        let system_data_scope_rule = request.to_active_model(system_data_scope_rule);
        system_data_scope_rule.update(&self.db).await?;
        Ok(())
    }

    pub async fn delete(&self, id: i64) -> Result<()> {
        let result = SystemDataScopeRuleEntity::delete_by_id(id).exec(&self.db).await?;
        if result.rows_affected == 0 {
            return Err(anyhow!("记录未找到"));
        }
        Ok(())
    }

    pub async fn get_by_id(&self, id: i64) -> Result<Option<SystemDataScopeRuleResponse>> {
        let system_data_scope_rule = SystemDataScopeRuleEntity::find_by_id(id).one(&self.db).await?;
        Ok(system_data_scope_rule.map(SystemDataScopeRuleResponse::from))
    }

    pub async fn get_paginated(&self, page: u64, size: u64) -> Result<PaginatedResponse> {
        let paginator = SystemDataScopeRuleEntity::find()
            .order_by_desc(Column::UpdateTime)
            .paginate(&self.db, size);
        
        let total_items = paginator.num_items().await?;
        let total_pages = (total_items + page_size - 1) / page_size; // 向上取整
        let records = paginator
            .fetch_page(page - 1) // SeaORM 页码从 0 开始，所以减 1
            .await?
            .into_iter()
            .map(SystemDataScopeRuleResponse::from)
            .collect();

        Ok(PaginatedResponse {
            records,
            total_pages,
            current_page: page,
            page_size,
            total_items,
        })
    }

    pub async fn get_all(&self) -> Result<Vec<SystemDataScopeRuleResponse>> {
        let list = SystemDataScopeRuleEntity::find().all(&self.db).await?;
        Ok(list.into_iter().map(SystemDataScopeRuleResponse::from).collect())
    }
}