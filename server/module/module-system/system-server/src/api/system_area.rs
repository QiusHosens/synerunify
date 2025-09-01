use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tracing::{info, error};
use utoipa::ToSchema;
use utoipa_axum::router::OpenApiRouter;
use utoipa_axum::routes;
use common::base::response::CommonResult;
use system_model::response::system_area::AreaResponse;
use crate::{
    utils::area_utils::{get_area_cache, Area, AreaType, CacheStats},
};
use crate::convert::system_area::model_to_response;

/// 区域查询参数
// #[derive(Debug, Deserialize, ToSchema, utoipa::IntoParams)]
// pub struct AreaQueryParams {
//     /// 区域名称关键词（模糊搜索）
//     pub keyword: Option<String>,
//     /// 区域类型
//     pub area_type: Option<i32>,
//     /// 父级区域ID
//     pub parent_id: Option<i32>,
//     /// 是否包含子区域
//     pub include_children: Option<bool>,
// }
//
// /// 区域路径响应结构
// #[derive(Debug, Serialize, ToSchema)]
// pub struct AreaPathResponse {
//     /// 区域ID
//     pub id: i32,
//     /// 区域名称
//     pub name: String,
//     /// 完整路径
//     pub path: String,
// }

/// 创建区域路由
pub async fn system_area_router() -> OpenApiRouter {
    OpenApiRouter::new()
        .routes(routes!(get_areas))
        // .route("/areas/:id", get(get_area_by_id))
        // .route("/areas/search", get(search_areas))
        // .route("/areas/:id/children", get(get_area_children))
        // .route("/areas/:id/parents", get(get_area_parents))
        // .route("/areas/:id/path", get(get_area_path))
        // .route("/areas/countries", get(get_countries))
        // .route("/areas/provinces/:country_id", get(get_provinces))
        // .route("/areas/cities/:province_id", get(get_cities))
        // .route("/areas/stats", get(get_cache_stats))
}

/// 获取区域列表
#[utoipa::path(
    get,
    path = "/areas",
    operation_id = "system_area_areas",
    responses(
        (status = 200, description = "get areas", body = CommonResult<Vec<AreaResponse>>),
    ),
    tag = "system_area"
)]
async fn get_areas() -> CommonResult<Vec<AreaResponse>> {
    let cache = get_area_cache();
    let areas = cache.get_all_children(1);
    CommonResult::with_data(areas.into_iter().map(model_to_response).collect())

    // let areas = if let Some(parent_id) = params.parent_id {
    //     // 获取指定父级下的区域
    //     cache.get_children(parent_id)
    // } else if let Some(keyword) = params.keyword {
    //     // 按关键词搜索
    //     cache.search_by_name(&keyword)
    // } else {
    //     // 获取所有顶级区域（国家）
    //     cache.get_countries()
    // };
    //
    // // 过滤区域类型
    // let filtered_areas = if let Some(area_type) = params.area_type {
    //     areas.into_iter()
    //         .filter(|area| area.area_type as i32 == area_type)
    //         .collect()
    // } else {
    //     areas
    // };
    //
    // // 转换为响应格式
    // let response_areas: Vec<AreaResponse> = if params.include_children.unwrap_or(false) {
    //     filtered_areas.into_iter().map(AreaResponse::from).collect()
    // } else {
    //     filtered_areas.into_iter()
    //         .map(|mut area| {
    //             area.children = Vec::new(); // 不包含子区域
    //             AreaResponse::from(area)
    //         })
    //         .collect()
    // };
    //
    // Ok(Json(ApiResponse::success(response_areas)))
}

// /// 根据ID获取区域信息
// #[utoipa::path(
//     get,
//     path = "/areas/{id}",
//     params(
//         ("id" = i32, Path, description = "区域ID")
//     ),
//     responses(
//         (status = 200, description = "成功", body = AreaResponse),
//         (status = 404, description = "区域不存在"),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_area_by_id(
//     Path(id): Path<i32>,
// ) -> Result<Json<ApiResponse<AreaResponse>>, StatusCode> {
//     let cache = get_area_cache();
//
//     match cache.get_by_id(id) {
//         Some(area) => Ok(Json(ApiResponse::success(AreaResponse::from(area)))),
//         None => Err(StatusCode::NOT_FOUND),
//     }
// }
//
// /// 搜索区域
// #[utoipa::path(
//     get,
//     path = "/api/areas/search",
//     params(
//         ("keyword" = String, Query, description = "搜索关键词")
//     ),
//     responses(
//         (status = 200, description = "成功", body = Vec<AreaResponse>),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn search_areas(
//     Query(params): Query<AreaQueryParams>,
// ) -> Result<Json<ApiResponse<Vec<AreaResponse>>>, StatusCode> {
//     let keyword = params.keyword.ok_or(StatusCode::BAD_REQUEST)?;
//     let cache = get_area_cache();
//
//     let areas = cache.search_by_name(&keyword);
//     let response_areas: Vec<AreaResponse> = areas.into_iter().map(AreaResponse::from).collect();
//
//     Ok(Json(ApiResponse::success(response_areas)))
// }
//
// /// 获取指定区域的子区域
// #[utoipa::path(
//     get,
//     path = "/api/areas/{id}/children",
//     params(
//         ("id" = i32, Path, description = "区域ID")
//     ),
//     responses(
//         (status = 200, description = "成功", body = Vec<AreaResponse>),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_area_children(
//     Path(id): Path<i32>,
// ) -> Result<Json<ApiResponse<Vec<AreaResponse>>>, StatusCode> {
//     let cache = get_area_cache();
//
//     let children = cache.get_children(id);
//     let response_children: Vec<AreaResponse> = children.into_iter().map(AreaResponse::from).collect();
//
//     Ok(Json(ApiResponse::success(response_children)))
// }
//
// /// 获取指定区域的所有父级区域
// #[utoipa::path(
//     get,
//     path = "/api/areas/{id}/parents",
//     params(
//         ("id" = i32, Path, description = "区域ID")
//     ),
//     responses(
//         (status = 200, description = "成功", body = Vec<AreaResponse>),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_area_parents(
//     Path(id): Path<i32>,
// ) -> Result<Json<ApiResponse<Vec<AreaResponse>>>, StatusCode> {
//     let cache = get_area_cache();
//
//     let parents = cache.get_parents(id);
//     let response_parents: Vec<AreaResponse> = parents.into_iter().map(AreaResponse::from).collect();
//
//     Ok(Json(ApiResponse::success(response_parents)))
// }
//
// /// 获取指定区域的完整路径
// #[utoipa::path(
//     get,
//     path = "/api/areas/{id}/path",
//     params(
//         ("id" = i32, Path, description = "区域ID")
//     ),
//     responses(
//         (status = 200, description = "成功", body = AreaPathResponse),
//         (status = 404, description = "区域不存在"),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_area_path(
//     Path(id): Path<i32>,
// ) -> Result<Json<ApiResponse<AreaPathResponse>>, StatusCode> {
//     let cache = get_area_cache();
//
//     match cache.get_by_id(id) {
//         Some(area) => {
//             let path = cache.get_area_path(id);
//             let response = AreaPathResponse {
//                 id: area.id,
//                 name: area.name,
//                 path,
//             };
//             Ok(Json(ApiResponse::success(response)))
//         }
//         None => Err(StatusCode::NOT_FOUND),
//     }
// }
//
// /// 获取所有国家/地区
// #[utoipa::path(
//     get,
//     path = "/api/areas/countries",
//     responses(
//         (status = 200, description = "成功", body = Vec<AreaResponse>),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_countries() -> Result<Json<ApiResponse<Vec<AreaResponse>>>, StatusCode> {
//     let cache = get_area_cache();
//
//     let countries = cache.get_countries();
//     let response_countries: Vec<AreaResponse> = countries.into_iter().map(AreaResponse::from).collect();
//
//     Ok(Json(ApiResponse::success(response_countries)))
// }
//
// /// 获取指定国家的所有省份
// #[utoipa::path(
//     get,
//     path = "/api/areas/provinces/{country_id}",
//     params(
//         ("country_id" = i32, Path, description = "国家ID")
//     ),
//     responses(
//         (status = 200, description = "成功", body = Vec<AreaResponse>),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_provinces(
//     Path(country_id): Path<i32>,
// ) -> Result<Json<ApiResponse<Vec<AreaResponse>>>, StatusCode> {
//     let cache = get_area_cache();
//
//     let provinces = cache.get_provinces(country_id);
//     let response_provinces: Vec<AreaResponse> = provinces.into_iter().map(AreaResponse::from).collect();
//
//     Ok(Json(ApiResponse::success(response_provinces)))
// }
//
// /// 获取指定省份的所有城市
// #[utoipa::path(
//     get,
//     path = "/api/areas/cities/{province_id}",
//     params(
//         ("province_id" = i32, Path, description = "省份ID")
//     ),
//     responses(
//         (status = 200, description = "成功", body = Vec<AreaResponse>),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_cities(
//     Path(province_id): Path<i32>,
// ) -> Result<Json<ApiResponse<Vec<AreaResponse>>>, StatusCode> {
//     let cache = get_area_cache();
//
//     let cities = cache.get_cities(province_id);
//     let response_cities: Vec<AreaResponse> = cities.into_iter().map(AreaResponse::from).collect();
//
//     Ok(Json(ApiResponse::success(response_cities)))
// }
//
// /// 获取缓存统计信息
// #[utoipa::path(
//     get,
//     path = "/api/areas/stats",
//     responses(
//         (status = 200, description = "成功", body = CacheStats),
//         (status = 500, description = "服务器错误")
//     ),
//     tag = "区域管理"
// )]
// pub async fn get_cache_stats() -> Result<Json<ApiResponse<CacheStats>>, StatusCode> {
//     let cache = get_area_cache();
//
//     let stats = cache.get_cache_stats();
//     Ok(Json(ApiResponse::success(stats)))
// }
