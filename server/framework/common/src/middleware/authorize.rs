use crate::config::config::Config;
use crate::context::context::{LoginUserContext, RequestContext};
use anyhow::Result;
use axum::extract::OriginalUri;
use axum::http::Method;
use axum::routing::MethodRouter;
use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};
use dashmap::mapref::one::Ref;
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regex::Regex;
use std::str::FromStr;
use tracing::{error, info};
use utoipa::openapi;
use utoipa::openapi::path::Operation;

/// 全局静态变量存储路由和授权的映射
/// 静态路由授权
pub static STATIC_ROUTE_AUTHORIZES: Lazy<DashMap<String, Vec<String>>> = Lazy::new(|| {
    DashMap::new()
});
/// 动态路由授权
pub static DYNAMIC_ROUTE_AUTHORIZES: Lazy<DashMap<String, Vec<String>>> = Lazy::new(|| {
    DashMap::new()
});

/// 全局静态变量存储操作和授权的映射
pub static OPERATION_AUTHORIZES: Lazy<DashMap<String, Vec<String>>> = Lazy::new(|| {
    DashMap::new()
});

/// 注册操作id和权限的函数
pub fn register_operation_authorizes(operation_id: &str, authorizes: Vec<String>) {
    // println!("Registering operation id: {} with authorizes: {:?}", operation_id, authorizes);
    OPERATION_AUTHORIZES.insert(operation_id.to_string(), authorizes);
}

/// 初始化路由和授权,从openapi里面获取路由和操作id的对应关系,再根据操作id和授权的对应关系关联路由和授权
pub fn init_route_authorizes(openapi: &openapi::OpenApi) {
    for (path, path_item) in openapi.paths.paths.iter() {
        process_operation(&path_item.get, "get", path);
        process_operation(&path_item.post, "post", path);
        // process_operation(&path_item.put, "put", path, &permissions);
        // process_operation(&path_item.delete, "delete", path, &permissions);
        // process_operation(&path_item.patch, "patch", path, &permissions);
    }
}

fn process_operation(
    operation: &Option<Operation>,
    method_str: &str,
    path: &str,
) {
    if let Some(op) = operation {
        if let Some(operation_id) = &op.operation_id {
            if let Ok(method) = Method::from_str(method_str) {
                register_route_authorizes(method, path, operation_id);
            }
        }
    }
}

fn register_route_authorizes(method: Method, path: &str, operation_id: &str) {
    // println!("Registering route: {:?} with operation id: {:?}", path, operation_id);
    if let Some(authorizes) = OPERATION_AUTHORIZES.get(operation_id) {
        let is_dynamic_route = is_dynamic_route(path);
        // println!("Registering {} route: {:?} with authorizes: {:?}", if is_dynamic_route {"dynamic"} else {"static"}, path, authorizes.value());
        if is_dynamic_route {
            DYNAMIC_ROUTE_AUTHORIZES.insert(path.to_string(), authorizes.value().clone());
        } else {
            STATIC_ROUTE_AUTHORIZES.insert(path.to_string(), authorizes.value().clone());
        }
    }
}

/// 判断是否为动态路由
fn is_dynamic_route(route: &str) -> bool {
    // 检查是否有动态参数 {param} 或通配符 *param
    route.contains('{') || route.contains("*")
}

/// 检查路由是否匹配path
fn matches_route(route: &str, path: &str) -> bool {
    // 移除前导和尾随的斜杠以规范化
    let route = route.trim_matches('/').to_string();
    let path = path.trim_matches('/').to_string();

    // 将 route 和 path 按斜杠分割为段
    let route_segments: Vec<&str> = route.split('/').collect();
    let path_segments: Vec<&str> = path.split('/').collect();

    // 如果 route 以 *param 结尾，特殊处理通配符
    if route_segments.last().map_or(false, |s| s.starts_with('*')) {
        // 通配符必须在最后，且 route 段数 <= path 段数
        if route_segments.len() - 1 > path_segments.len() {
            return false;
        }
        // 检查前面的段是否匹配（忽略通配符部分）
        for (r_seg, p_seg) in route_segments[..route_segments.len() - 1]
            .iter()
            .zip(path_segments.iter())
        {
            if r_seg.starts_with('{') && r_seg.ends_with('}') {
                // 动态参数，跳过检查（只要 path 有值就行）
                if p_seg.is_empty() {
                    return false;
                }
            } else if r_seg != p_seg {
                // 静态段必须完全匹配
                return false;
            }
        }
        return true; // 通配符匹配剩余部分
    }

    // 非通配符情况：段数必须相等
    if route_segments.len() != path_segments.len() {
        return false;
    }

    // 逐段匹配
    for (r_seg, p_seg) in route_segments.iter().zip(path_segments.iter()) {
        if r_seg.starts_with('{') && r_seg.ends_with('}') {
            // 动态参数，检查 path 段是否非空
            if p_seg.is_empty() {
                return false;
            }
        } else if r_seg != p_seg {
            // 静态段必须完全匹配
            return false;
        }
    }

    true
}
/// 静态路由获取权限码
fn get_authorizes_static_route(path: &str) -> Option<Vec<String>> {
    if let Some(authorizes) = STATIC_ROUTE_AUTHORIZES.get(path) {
        return Some(authorizes.value().clone());
    }
    None
}
/// 动态路由获取权限码
fn get_authorizes_dynamic_route(path: &str) -> Option<Vec<String>> {
    for entry in DYNAMIC_ROUTE_AUTHORIZES.iter() {
        let route = entry.key();
        if matches_route(route, path) {
            let authorizes = entry.value();
            return Some(authorizes.clone());
        }
    }
    None
}
/// 获取地址授权,先获取静态路由授权,如果没有,则再获取动态路由授权
fn get_authorizes(path: &str) -> Option<Vec<String>> {
    let authorizes = get_authorizes_static_route(path);
    if authorizes.is_some() {
        return authorizes;
    }
    get_authorizes_dynamic_route(path)
}

pub async fn authorize_handler(request: Request, next: Next) -> Result<Response, StatusCode> {
    // 获取path
    let config = Config::load();
    // 请求信息ctx注入
    let original_uri_path = if let Some(path) = request.extensions().get::<OriginalUri>() {
        path.0.path().to_owned()
    } else {
        request.uri().path().to_owned()
    };
    let path = format!("/{}", original_uri_path.replacen(&(config.api_prefix.clone() + "/"), "", 1));
    // 获取目标路由的权限要求
    let mut authorizes = get_authorizes(path.as_str());
    info!("path: {:?}, authorizes: {:?}", path, authorizes);
    
    // 没有授权,则直接请求
    match authorizes {
        None => {
            Ok(next.run(request).await)
        }
        Some(mut auth) => {
            let login_user = request.extensions().get::<LoginUserContext>();
            match login_user {
                None => Err(StatusCode::UNAUTHORIZED),
                Some(user) => {
                    // 移除空字符串
                    auth.retain(|s| !s.is_empty());
                    // 校验授权
                    let user_permissions = user.clone().permissions.split(",").map(String::from).collect();
                    let has_permission = verify_permission(user_permissions, auth.clone());
                    info!("has permission: {:?}, auth: {:?}", has_permission, auth);
                    if has_permission {
                        Ok(next.run(request).await)
                    } else {
                        Err(StatusCode::UNAUTHORIZED)
                    }

                }
            }
        }
    }
}

pub fn verify_permission(user_permissions: Vec<String>, api_permissions: Vec<String>) -> bool {
    // 如果API没有任何权限要求，则返回true
    if api_permissions.is_empty() {
        return true;
    }

    // 检查是否有任何一个api_permissions存在于user_permissions中
    api_permissions.iter().any(|perm| user_permissions.contains(perm))
}
