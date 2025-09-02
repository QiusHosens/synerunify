use crate::service::system_area;
use axum::extract::Path;
use common::base::response::CommonResult;
use system_model::response::system_area::{AreaPathResponse, AreaResponse};
use utoipa::ToSchema;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;

/// 创建区域路由
pub async fn system_area_router() -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(get_tree))
        .routes(routes!(get_by_id))
        .routes(routes!(get_path))
}

/// 获取区域列表
#[utoipa::path(
    get,
    path = "/tree",
    operation_id = "system_area_tree",
    responses(
        (status = 200, description = "get area tree", body = CommonResult<Vec<AreaResponse>>),
    ),
    tag = "system_area"
)]
async fn get_tree() -> CommonResult<Vec<AreaResponse>> {
    CommonResult::with_data(system_area::get_tree().unwrap())
}

#[utoipa::path(
    get,
    path = "/get/{id}",
    params(
        ("id" = i32, Path, description = "区域ID")
    ),
    operation_id = "system_area_get_by_id",
    responses(
        (status = 200, description = "成功", body = CommonResult<AreaResponse>),
    ),
    tag = "system_area"
)]
async fn get_by_id(
    Path(id): Path<i32>,
) -> CommonResult<AreaResponse> {
    match system_area::get_by_id(id) {
        Ok(Some(data)) => CommonResult::with_data(data),
        Ok(None) => CommonResult::with_none(),
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}

#[utoipa::path(
    get,
    path = "/path/{id}",
    params(
        ("id" = i32, Path, description = "区域ID")
    ),
    responses(
        (status = 200, description = "成功", body = CommonResult<AreaPathResponse>),
    ),
    tag = "system_area"
)]
pub async fn get_path(
    Path(id): Path<i32>,
) -> CommonResult<AreaPathResponse> {
    match system_area::get_path(id) {
        Ok(Some(data)) => CommonResult::with_data(data),
        Ok(None) => CommonResult::with_none(),
        Err(e) => {CommonResult::with_err(&e.to_string())}
    }
}