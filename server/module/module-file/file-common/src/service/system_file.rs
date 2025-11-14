use axum::extract::Multipart;
use common::utils::minio_utils::{MinioClient, MinioError, BUCKET_NAME};
use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, DatabaseTransaction, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use crate::model::system_file::{Model as SystemFileModel, ActiveModel as SystemFileActiveModel, Entity as SystemFileEntity, Column};
use file_model::request::system_file::{CreateSystemFileRequest, UpdateSystemFileRequest, PaginatedKeywordRequest};
use file_model::response::system_file::{SystemFileDataResponse, SystemFileResponse};
use crate::convert::system_file::{create_request_to_model, model_to_data_response, model_to_response, update_request_to_model};
use anyhow::{anyhow, Context, Ok, Result};
use sea_orm::ActiveValue::Set;
use common::constants::enum_constants::{ROOT_TENANT_ID, STATUS_DISABLE, STATUS_ENABLE};
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;

pub async fn create(db: &DatabaseConnection, login_user: LoginUserContext, request: CreateSystemFileRequest) -> Result<i64> {
    let mut system_file = create_request_to_model(&request);
    system_file.creator = Set(Some(login_user.id));
    system_file.updater = Set(Some(login_user.id));
    system_file.tenant_id = Set(login_user.tenant_id);
    let system_file = system_file.insert(db).await?;
    Ok(system_file.id)
}

pub async fn update(db: &DatabaseConnection, login_user: LoginUserContext, request: UpdateSystemFileRequest) -> Result<()> {
    let system_file = SystemFileEntity::find_by_id(request.id)
        .one(db)
        .await?
        .ok_or_else(|| anyhow!("记录未找到"))?;

    let mut system_file = update_request_to_model(&request, system_file);
    system_file.updater = Set(Some(login_user.id));
    system_file.update(db).await?;
    Ok(())
}

pub async fn delete(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_file = SystemFileActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        deleted: Set(true),
        ..Default::default()
    };
    system_file.update(db).await?;
    Ok(())
}

pub async fn get_by_id(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<Option<SystemFileResponse>> {
    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_file = SystemFileEntity::find_active_with_condition(condition)
        .one(db).await?;
    Ok(system_file.map(model_to_response))
}

pub async fn get_paginated(db: &DatabaseConnection, login_user: LoginUserContext, params: PaginatedKeywordRequest) -> Result<PaginatedResponse<SystemFileResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let paginator = SystemFileEntity::find_active_with_condition(condition)
        .order_by_desc(Column::UpdateTime)
        .paginate(db, params.base.size);

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

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemFileResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));let list = SystemFileEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn enable(db: &DatabaseConnection, login_user: LoginUserContext, id: i64) -> Result<()> {
    let system_file = SystemFileActiveModel {
        id: Set(id),
        updater: Set(Some(login_user.id)),
        status: Set(STATUS_ENABLE),
        ..Default::default()
    };
    system_file.update(db).await?;
    Ok(())
}

pub async fn enable_outer(_db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, ids: Vec<i64>) -> Result<()> {
    if ids.is_empty() {
        return Ok(());
    }

    SystemFileEntity::update_many()
        .col_expr(Column::Status, Expr::value(STATUS_ENABLE))
        .col_expr(Column::Updater, Expr::value(Some(login_user.id)))
        .filter(Column::Id.is_in(ids))
        .exec(txn)
        .await?;
    Ok(())
}

pub async fn disable_outer(_db: &DatabaseConnection, txn: &DatabaseTransaction, login_user: LoginUserContext, ids: Vec<i64>) -> Result<()> {
    if ids.is_empty() {
        return Ok(());
    }

    SystemFileEntity::update_many()
        .col_expr(Column::Status, Expr::value(STATUS_DISABLE))
        .col_expr(Column::Updater, Expr::value(Some(login_user.id)))
        .filter(Column::Id.is_in(ids))
        .exec(txn)
        .await?;
    Ok(())
}

pub async fn list_by_ids(db: &DatabaseConnection, login_user: LoginUserContext, ids: Vec<i64>) -> Result<Vec<SystemFileModel>> {
    let list = SystemFileEntity::find_active()
        .filter(Column::Id.is_in(ids))
        .filter(Column::TenantId.eq(login_user.tenant_id))
        .all(db).await?;
    Ok(list)
}

pub async fn upload(db: &DatabaseConnection, login_user: LoginUserContext, minio: Option<MinioClient>, mut multipart: Multipart) -> Result<Option<i64>> {
    if minio.is_none() {
        return Err(anyhow!("客户端初始化失败"));
    }
    let minio = minio.unwrap();
    
    while let Some(field) = multipart.next_field().await.context("文件读取失败")? {
        if field.name() == Some("file") {
            let file_name = field.file_name().unwrap_or("unnamed").to_string();
            let content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
            let data = field.bytes().await.context("文件读取失败")?;
            
            // Upload to MinIO
            let path = match minio.upload_file(&file_name, &data).await {
                std::result::Result::Ok(path) => path,
                Err(_) => {
                    return Err(anyhow!("文件上传失败"));
                },
            };

            // 保存到数据库,默认停用
            let system_file = SystemFileActiveModel {
                file_name: Set(file_name),
                file_type: Set(Some(content_type)),
                file_size: Set(data.len() as i64),
                file_path: Set(path),
                status: Set(STATUS_DISABLE),
                department_code: Set(login_user.department_code),
                department_id: Set(login_user.department_id),
                creator: Set(Some(login_user.id)),
                updater: Set(Some(login_user.id)),
                tenant_id: Set(login_user.tenant_id),
                ..Default::default()
            };
            let system_file = system_file.insert(db).await?;
            return Ok(Some(system_file.id))
        }
    }

    Ok(None)
}

pub async fn upload_for_path(db: &DatabaseConnection, login_user: LoginUserContext, minio: Option<MinioClient>, mut multipart: Multipart) -> Result<Option<String>> {
    if minio.is_none() {
        return Err(anyhow!("客户端初始化失败"));
    }
    let minio = minio.unwrap();

    while let Some(field) = multipart.next_field().await.context("文件读取失败")? {
        if field.name() == Some("file") {
            let file_name = field.file_name().unwrap_or("unnamed").to_string();
            let content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
            let data = field.bytes().await.context("文件读取失败")?;

            // Upload to MinIO
            let path = match minio.upload_file(&file_name, &data).await {
                std::result::Result::Ok(path) => path,
                Err(_) => {
                    return Err(anyhow!("文件上传失败"));
                },
            };

            // 保存到数据库,默认停用
            let system_file = SystemFileActiveModel {
                file_name: Set(file_name),
                file_type: Set(Some(content_type)),
                file_size: Set(data.len() as i64),
                file_path: Set(path.clone()),
                status: Set(STATUS_DISABLE),
                department_code: Set(login_user.department_code),
                department_id: Set(login_user.department_id),
                creator: Set(Some(login_user.id)),
                updater: Set(Some(login_user.id)),
                tenant_id: Set(login_user.tenant_id),
                ..Default::default()
            };
            system_file.insert(db).await?;
            let all_path = format!("{}/{}", BUCKET_NAME, path);
            return Ok(Some(all_path))
        }
    }

    Ok(None)
}

pub async fn upload_oss(minio: Option<MinioClient>, mut multipart: Multipart) -> Result<Option<String>> {
    if minio.is_none() {
        return Err(anyhow!("客户端初始化失败"));
    }
    let minio = minio.unwrap();

    while let Some(field) = multipart.next_field().await.context("文件读取失败")? {
        if field.name() == Some("file") {
            let file_name = field.file_name().unwrap_or("unnamed").to_string();
            let content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
            let data = field.bytes().await.context("文件读取失败")?;

            // Upload to MinIO
            let path = match minio.upload_file(&file_name, &data).await {
                std::result::Result::Ok(path) => path,
                Err(_) => {
                    return Err(anyhow!("文件上传失败"));
                },
            };
            let all_path = format!("{}/{}", BUCKET_NAME, path);
            return Ok(Some(all_path))
        }
    }

    Ok(None)
}

pub async fn get_file_data(db: &DatabaseConnection, login_user: LoginUserContext, minio: Option<MinioClient>, id: i64) -> Result<Option<SystemFileDataResponse>> {
    if minio.is_none() {
        return Err(anyhow!("客户端初始化失败"));
    }
    let minio = minio.unwrap();

    let condition = Condition::all()
            .add(Column::Id.eq(id))
            .add(Column::TenantId.eq(login_user.tenant_id));
            
    let system_file = SystemFileEntity::find_active_with_condition(condition)
        .one(db).await?;

    if system_file.is_none() {
        return Err(anyhow!("文件未找到"));
    }
    let system_file = system_file.unwrap();

    let data = match minio.download_file(system_file.file_path.clone()).await {
        std::result::Result::Ok(data) => data,
        Err(_) => return Err(anyhow!("文件下载失败")),
    };

    Ok(Some(model_to_data_response(system_file, data)))
}

pub async fn get_file_data_no_auth(db: &DatabaseConnection, minio: Option<MinioClient>, id: i64) -> Result<Option<SystemFileDataResponse>> {
    if minio.is_none() {
        return Err(anyhow!("客户端初始化失败"));
    }
    let minio = minio.unwrap();

    let condition = Condition::all()
        .add(Column::Id.eq(id));

    let system_file = SystemFileEntity::find_active_with_condition(condition)
        .one(db).await?;

    if system_file.is_none() {
        return Err(anyhow!("文件未找到"));
    }
    let system_file = system_file.unwrap();

    let data = match minio.download_file(system_file.file_path.clone()).await {
        std::result::Result::Ok(data) => data,
        Err(_) => return Err(anyhow!("文件下载失败")),
    };

    Ok(Some(model_to_data_response(system_file, data)))
}

pub async fn get_file_data_by_path(minio: Option<MinioClient>, file_path: String) -> Result<Option<Vec<u8>>> {
    if minio.is_none() {
        return Err(anyhow!("客户端初始化失败"));
    }
    let minio = minio.unwrap();

    let data = match minio.download_file(file_path).await {
        std::result::Result::Ok(data) => data,
        Err(_) => return Err(anyhow!("文件下载失败")),
    };

    Ok(Some(data))
}