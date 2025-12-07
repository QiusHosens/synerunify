use std::sync::Arc;
use sea_orm::DatabaseConnection;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use ctor;
use macros::require_authorize;
use axum::{routing::{get, post}, Router, extract::{State, Path, Json, Query}, response::IntoResponse, Extension};
use common::base::page::PaginatedResponse;
use mall_model::request::mall_product_spu::{CreateMallProductSpuRequest, UpdateMallProductSpuRequest, PaginatedKeywordRequest, PaginatedCategoryKeywordRequest, PaginatedTenantKeywordRequest, MallProductSpuPublishRequest};
use mall_model::response::mall_product_spu::{MallProductSpuBaseResponse, MallProductSpuInfoResponse, MallProductSpuPageResponse, MallProductSpuResponse, MallProductSpuStoreResponse};
use common::base::response::CommonResult;
use common::context::context::LoginUserContext;
use crate::service;
use common::state::app_state::AppState;

pub async fn mall_product_spu_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(create))
        .routes(routes!(update))
        .routes(routes!(delete))
        .routes(routes!(get_by_id))
        .routes(routes!(get_base_by_id))
        .routes(routes!(get_info_by_id))
        .routes(routes!(list))
        .routes(routes!(page))
        .routes(routes!(enable))
        .routes(routes!(disable))
        .routes(routes!(publish))
        .routes(routes!(unpublish))
        .with_state(state)
}

pub async fn mall_product_spu_no_auth_router(state: AppState) -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(page_all))
        .routes(routes!(page_tenant))
        .routes(routes!(get_info_by_id_without_user))
        .with_state(state)
}

pub async fn mall_product_spu_route(state: AppState) -> Router {
    Router::new()
        .route("/create", post(create))
        .route("/update", post(update))
        .route("/delete/{id}", post(delete))
        .route("/get/{id}", get(get_by_id))
        .route("/get/{id}", get(get_base_by_id))
        .route("/list", get(list))
        .route("/page", get(page))
        .with_state(state)
}

#[utoipa::path(
    post,
    path = "/create",
    operation_id = "mall_product_spu_create",
    request_body(content = CreateMallProductSpuRequest, description = "create", content_type = "application/json"),
    responses(
        (status = 200, description = "id", body = CommonResult<i64>)
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_create", authorize = "")]
async fn create(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<CreateMallProductSpuRequest>,
) -> CommonResult<i64> {
    match service::mall_product_spu::create(&state.db, login_user, payload).await {
        Ok(id) => {CommonResult::with_data(id)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/update",
    operation_id = "mall_product_spu_update",
    request_body(content = UpdateMallProductSpuRequest, description = "update", content_type = "application/json"),
    responses(
        (status = 204, description = "update")
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_update", authorize = "")]
async fn update(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<UpdateMallProductSpuRequest>,
) -> CommonResult<()> {
    match service::mall_product_spu::update(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/delete/{id}",
    operation_id = "mall_product_spu_delete",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "delete")
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_delete", authorize = "")]
async fn delete(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_product_spu::delete(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    operation_id = "mall_product_spu_get_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get by id", body = CommonResult<MallProductSpuResponse>)
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_get_by_id", authorize = "")]
async fn get_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<MallProductSpuResponse> {
    match service::mall_product_spu::get_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_base/{id}",
    operation_id = "mall_product_spu_get_base_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get base by id", body = CommonResult<MallProductSpuBaseResponse>)
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_get_base_by_id", authorize = "")]
async fn get_base_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<MallProductSpuBaseResponse> {
    match service::mall_product_spu::get_base_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_info/{id}",
    operation_id = "mall_product_spu_get_info_by_id",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get info by id", body = CommonResult<MallProductSpuInfoResponse>)
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_get_info_by_id", authorize = "")]
async fn get_info_by_id(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<MallProductSpuInfoResponse> {
    match service::mall_product_spu::get_info_by_id(&state.db, login_user, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/get_info_without_user/{id}",
    operation_id = "mall_product_spu_get_info_by_id_without_user",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 200, description = "get info by id without user", body = CommonResult<MallProductSpuInfoResponse>)
    ),
    tag = "mall_product_spu",
)]
async fn get_info_by_id_without_user(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> CommonResult<MallProductSpuInfoResponse> {
    match service::mall_product_spu::get_info_by_id_without_user(&state.db, id).await {
        Ok(Some(data)) => {CommonResult::with_data(data)}
        Ok(None) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page",
    operation_id = "mall_product_spu_page",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page", body = CommonResult<PaginatedResponse<MallProductSpuPageResponse>>)
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_page", authorize = "")]
async fn page(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Query(params): Query<PaginatedKeywordRequest>,
) -> CommonResult<PaginatedResponse<MallProductSpuPageResponse>> {
    match service::mall_product_spu::get_paginated(&state.db, login_user, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page_all",
    operation_id = "mall_product_spu_page_all",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("category_id" = Option<i64>, Query, description = "category id"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page all tenant", body = CommonResult<PaginatedResponse<MallProductSpuStoreResponse>>)
    ),
    tag = "mall_product_spu",
)]
async fn page_all(
    State(state): State<AppState>,
    Query(params): Query<PaginatedCategoryKeywordRequest>,
) -> CommonResult<PaginatedResponse<MallProductSpuStoreResponse>> {
    match service::mall_product_spu::get_paginated_all(&state.db, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/page_tenant",
    operation_id = "mall_product_spu_page_tenant",
    params(
        ("page" = u64, Query, description = "page number"),
        ("size" = u64, Query, description = "page size"),
        ("tenant_id" = Option<i64>, Query, description = "category id"),
        ("keyword" = Option<String>, Query, description = "keyword")
    ),
    responses(
        (status = 200, description = "get page by tenant", body = CommonResult<PaginatedResponse<MallProductSpuResponse>>)
    ),
    tag = "mall_product_spu",
)]
async fn page_tenant(
    State(state): State<AppState>,
    Query(params): Query<PaginatedTenantKeywordRequest>,
) -> CommonResult<PaginatedResponse<MallProductSpuResponse>> {
    match service::mall_product_spu::get_paginated_tenant(&state.db, params).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/list",
    operation_id = "mall_product_spu_list",
    responses(
        (status = 200, description = "list all", body = CommonResult<Vec<MallProductSpuResponse>>)
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_list", authorize = "")]
async fn list(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
) -> CommonResult<Vec<MallProductSpuResponse>> {
    match service::mall_product_spu::list(&state.db, login_user).await {
        Ok(data) => {CommonResult::with_data(data)}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/enable/{id}",
    operation_id = "mall_product_spu_enable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "enable")
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_enable", authorize = "")]
async fn enable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_product_spu::enable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/disable/{id}",
    operation_id = "mall_product_spu_disable",
    params(
        ("id" = i64, Path, description = "id")
    ),
    responses(
        (status = 204, description = "disable")
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_disable", authorize = "")]
async fn disable(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Path(id): Path<i64>,
) -> CommonResult<()> {
    match service::mall_product_spu::disable(&state.db, login_user, id).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/publish",
    operation_id = "mall_product_spu_publish",
    request_body(content = MallProductSpuPublishRequest, description = "publish", content_type = "application/json"),
    responses(
        (status = 204, description = "publish")
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_publish", authorize = "")]
async fn publish(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<MallProductSpuPublishRequest>,
) -> CommonResult<()> {
    match service::mall_product_spu::publish(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    post,
    path = "/unpublish",
    operation_id = "mall_product_spu_unpublish",
    request_body(content = MallProductSpuPublishRequest, description = "unpublish", content_type = "application/json"),
    responses(
        (status = 204, description = "unpublish")
    ),
    tag = "mall_product_spu",
    security(
        ("bearerAuth" = [])
    )
)]
#[require_authorize(operation_id = "mall_product_spu_unpublish", authorize = "")]
async fn unpublish(
    State(state): State<AppState>,
    Extension(login_user): Extension<LoginUserContext>,
    Json(payload): Json<MallProductSpuPublishRequest>,
) -> CommonResult<()> {
    match service::mall_product_spu::unpublish(&state.db, login_user, payload).await {
        Ok(_) => {CommonResult::with_none()}
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}