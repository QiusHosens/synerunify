use std::str::FromStr;

use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, JoinType, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, RelationTrait};
use system_model::response::system_dict_type::SystemDictTypeResponse;
use crate::model::system_dict_data::{Model as SystemDictDataModel, ActiveModel as SystemDictDataActiveModel, Entity as SystemDictDataEntity, Column, Relation};
use crate::model::system_dict_type::{Entity as SystemDictTypeEntity, Column as SystemDictTypeColumn};
use system_model::request::system_dict_data::{CreateSystemDictDataRequest, UpdateSystemDictDataRequest, PaginatedKeywordRequest};
use system_model::response::system_dict_data::{SystemDictDataResponse, SystemDictDataDetailResponse};
use crate::convert::system_dict_data::{create_request_to_model, model_to_detail_response, model_to_response, update_request_to_model};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemDictDataRequest) -> Result<i64> {
    let mut system_dict_data = create_request_to_model(&request);
    system_dict_data.creator = Set(Some(login_user.id));
    system_dict_data.updater = Set(Some(login_user.id));
    
    let system_dict_data = system_dict_data.insert(db).await?;
    Ok(system_dict_data.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemDictDataRequest) -> Result<()> {
    let system_dict_data = SystemDictDataEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_dict_data = update_request_to_model(&request, system_dict_data);
    system_dict_data.updater = Set(Some(login_user.id));
    system_dict_data.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_dict_data = SystemDictDataActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_dict_data.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemDictDataResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id));
    let system_dict_data = SystemDictDataEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_dict_data.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemDictDataDetailResponse>> {
    let mut query = SystemDictDataEntity::find_active()
        .select_also(SystemDictTypeEntity)
        .join(JoinType::LeftJoin, Relation::DictType.def());

    // Apply keyword filter if not empty
    if let Some(keyword) = &params.base.keyword {
        if !keyword.is_empty() {
            query = query.filter(
                Condition::any()
                    .add(Column::Label.like(format!("%{}%", keyword)))
                    .add(SystemDictTypeColumn::Name.like(format!("%{}%", keyword))),
            );
        }
    }

    // Apply dict_type filter if not empty
    if let Some(dict_type) = &params.dict_type {
        if !dict_type.is_empty() {
            query = query.filter(
                Condition::any()
                    .add(Column::DictType.eq(dict_type)),
            );
        }
    }

    // Apply sort if not empty
    let mut is_default_sort = true;
    if let Some(field) = &params.base.field {
        if let Some(sort) = &params.base.sort {
            let is_asc = sort.to_lowercase() == "asc";
            // 动态应用排序，假设字段名与数据库列名一致
            match field.as_str() {
                // SystemDictDataEntity 的字段
                f if Column::from_str(f).is_ok() => {
                    let column = Column::from_str(f).unwrap();
                    is_default_sort = false;
                    query = if is_asc {
                        query.order_by_asc(column)
                    } else {
                        query.order_by_desc(column)
                    };
                }
                _ => {}
            }
        }
    }

    if is_default_sort {
        query = query
            .order_by_asc(SystemDictTypeColumn::Id)
            .order_by_asc(Column::Sort);
    }

    let paginator = query
        // .order_by_desc(Column::UpdateTime)
        // .into_model::<(SystemDictDataResponse, Option<SystemDictTypeResponse>)>()
        .paginate(db, params.base.size);

    let total = paginator.num_items().await?;
    let total_pages = (total + params.base.size - 1) / params.base.size; // 向上取整
    let list = paginator
        .fetch_page(params.base.page - 1) // SeaORM 页码从 0 开始，所以减 1
        .await?
        .into_iter()
        // .map(model_to_response)
        .map(|(data, type_data)| model_to_detail_response(data, type_data))
        // .map(|(data, type_data)| {
        //     let mut response = data;
        //     response.dict_type = type_data; // 假设 SystemDictDataResponse 有 dict_type 字段存储 SystemDictType 数据
        //     response
        // })
        .collect();

    Ok(PaginatedResponse {
        list,
        total_pages,
        page: params.base.page,
        size: params.base.size,
        total,
    })
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemDictDataResponse>> {
    let list = SystemDictDataEntity::find_active()
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}