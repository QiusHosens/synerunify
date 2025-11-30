use std::sync::Arc;
use file_common::service;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{extract::{Json, Multipart, Path, Query, State}, http::StatusCode, response::IntoResponse, routing::{get, post}, Extension, Router};
use common::base::page::PaginatedResponse;
use file_model::request::system_file::{CreateSystemFileRequest, PaginatedKeywordRequest, UpdateSystemFileRequest, UploadSystemFileRequest};
use file_model::response::system_file::SystemFileResponse;
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use common::state::app_state::AppState;

pub async fn system_file_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(upload))
        .routes(routes!(upload_for_path))
        .routes(routes!(download))
        .routes(routes!(download_with_suffix))
        .with_state(state)
}

pub async fn system_file_no_auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(preview))
        .routes(routes!(preview_path))
        .routes(routes!(upload_oss))
        .with_state(state)
}

pub async fn system_file_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "system_file_create",
    request_body(content = CreateSystemFileRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateSystemFileRequest>,
) -> CommonResult<i64> {
    match service::system_file::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "system_file_update",
    request_body(content = UpdateSystemFileRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateSystemFileRequest>,
) -> CommonResult<()> {
    match service::system_file::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "system_file_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::system_file::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "system_file_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<SystemFileResponse>)
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<SystemFileResponse> {
    match service::system_file::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "system_file_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<SystemFileResponse>>)
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<SystemFileResponse>> {
    match service::system_file::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "system_file_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<SystemFileResponse>>)
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<SystemFileResponse>> {
    match service::system_file::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/upload",
    operation_id = "system_file_upload",
    request_body(content_type = "multipart/form-data", content = UploadSystemFileRequest),
    responses(
        (status = 204, description = "upload")
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_upload", authorize = "")]
async fn upload(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    multipart: Multipart,
) -> CommonResult<i64> {
    match service::system_file::upload(&state.db, login_user, state.minio, multipart).await {
        Ok(Some(id)) => {CommonResult::with_data(id)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/upload_for_path",
    operation_id = "system_file_upload_for_path",
    request_body(content_type = "multipart/form-data", content = UploadSystemFileRequest),
    responses(
        (status = 204, description = "upload for path")
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_upload_for_path", authorize = "")]
async fn upload_for_path(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    multipart: Multipart,
) -> CommonResult<String> {
    match service::system_file::upload_for_path(&state.db, login_user, state.minio, multipart).await {
        Ok(Some(path)) => {CommonResult::with_data(path)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/upload_oss",
    operation_id = "system_file_upload_oss",
    request_body(content_type = "multipart/form-data", content = UploadSystemFileRequest),
    responses(
        (status = 204, description = "upload oss")
    ),
    tag = "system_file"
)]
async fn upload_oss(
    State(state): State<AppState>,
    multipart: Multipart,
) -> CommonResult<String> {
    match service::system_file::upload_oss(state.minio, multipart).await {
        Ok(Some(path)) => {CommonResult::with_data(path)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/download/{id}",
    operation_id = "system_file_download",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "download", content_type = "application/octet-stream"),
        (status = 404, description = "File not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_download", authorize = "")]
async fn download(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, StatusCode> {
    let file = match service::system_file::get_file_data(&state.db, login_user, state.minio, id).await {
        Ok(Some(data)) => data,
        Ok(None) => {
            return Err(StatusCode::NOT_FOUND)
        },
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };
    
    let mut content_type = mime::APPLICATION_OCTET_STREAM;
    if file.file_type.is_some() {
        content_type = file.file_type
        .unwrap()
        .parse::<mime::Mime>()
        .unwrap_or(mime::APPLICATION_OCTET_STREAM);
    }

    Ok((
        StatusCode::OK,
        [
            (axum::http::header::CONTENT_TYPE, content_type.to_string()),
            (
                axum::http::header::CONTENT_DISPOSITION,
                format!("attachment; filename=\"{}\"", file.file_name)
            ),
        ],
        file.data,
    ))
}

#[utoipa::path(
    get,
    path = "/download_with_suffix/{name}",
    operation_id = "system_file_download_with_suffix",
    params(
        ("name" = String, Path, description = "name")
    ),
    responses(
        (status = 200, description = "download", content_type = "application/octet-stream"),
        (status = 404, description = "File not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "system_file",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "system_file_download_with_suffix", authorize = "")]
async fn download_with_suffix(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(name): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let id: i64 = name.split('.').next().unwrap().parse().unwrap();
    let file = match service::system_file::get_file_data(&state.db, login_user, state.minio, id).await {
        Ok(Some(data)) => data,
        Ok(None) => {
            return Err(StatusCode::NOT_FOUND)
        },
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };
    
    let mut content_type = mime::APPLICATION_OCTET_STREAM;
    if file.file_type.is_some() {
        content_type = file.file_type
        .unwrap()
        .parse::<mime::Mime>()
        .unwrap_or(mime::APPLICATION_OCTET_STREAM);
    }

    Ok((
        StatusCode::OK,
        [
            (axum::http::header::CONTENT_TYPE, content_type.to_string()),
            (
                axum::http::header::CONTENT_DISPOSITION,
                format!("attachment; filename=\"{}\"", file.file_name)
            ),
        ],
        file.data,
    ))
}

#[utoipa::path(
    get,
    path = "/preview/{id}",
    operation_id = "system_file_preview",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "preview", content_type = "application/octet-stream"),
        (status = 404, description = "File not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "system_file",
)]
async fn preview(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<impl IntoResponse, StatusCode> {
    let file = match service::system_file::get_file_data_no_auth(&state.db, state.minio, id).await {
        Ok(Some(data)) => data,
        Ok(None) => {
            return Err(StatusCode::NOT_FOUND)
        },
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let mut content_type = mime::APPLICATION_OCTET_STREAM;
    if file.file_type.is_some() {
        content_type = file.file_type
            .unwrap()
            .parse::<mime::Mime>()
            .unwrap_or(mime::APPLICATION_OCTET_STREAM);
    }

    Ok((
        StatusCode::OK,
        [
            (axum::http::header::CONTENT_TYPE, content_type.to_string()),
            (
                axum::http::header::CONTENT_DISPOSITION,
                format!("inline; filename=\"{}\"", file.file_name)
            ),
        ],
        file.data,
    ))
}

#[utoipa::path(
    get,
    path = "/preview_path/{*path}",
    operation_id = "system_file_preview_path",
    params(
        ("path" = String, Path, description = "path")
    ),
    responses(
        (status = 200, description = "preview", content_type = "application/octet-stream"),
        (status = 404, description = "File not found"),
        (status = 500, description = "Internal server error")
    ),
    tag = "system_file",
)]
async fn preview_path(
    State(state): State<AppState>,
    Path(path): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let (data, content_type) = match service::system_file::get_file_data_by_path(state.minio, path).await {
        Ok(Some(data)) => data,
        Ok(None) => {
            return Err(StatusCode::NOT_FOUND)
        },
        Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
    };

    Ok((
        StatusCode::OK,
        [
            (axum::http::header::CONTENT_TYPE, content_type.to_string()),
            (
                axum::http::header::CONTENT_DISPOSITION,
                format!("inline; filename=\"{}\"", "image")
            ),
        ],
        data,
    ))
}