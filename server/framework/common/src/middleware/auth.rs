use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};
use axum::routing::MethodRouter;
use tracing::info;
use crate::context::context::{LoginUserContext, RequestContext};

// 权限元数据
#[derive(Clone, Debug)]
pub struct Permissions(Vec<String>);

// 扩展 MethodRouter 以支持元数据
pub trait WithMetadata {
    fn with_metadata(self, permissions: Vec<String>) -> Self;
}

impl<S> WithMetadata for MethodRouter<S>
where
    S: Clone + Send + Sync + 'static,
{
    fn with_metadata(self, permissions: Vec<String>) -> Self {
        self.layer(axum::Extension(Permissions(permissions)))
    }
}

// 通配符匹配函数
fn matches_permission(required: &str, user_perm: &str) -> bool {
    if required == "*" {
        return true; // * 匹配所有权限
    }

    if required.ends_with(":*") {
        let prefix = required.trim_end_matches(":*");
        return user_perm.starts_with(prefix);
    }

    required == user_perm // 精确匹配
}

// 检查用户是否拥有所需权限
fn has_permission(user: &LoginUserContext, required_codes: &[String]) -> bool {
    return true;
    // let user_permissions: HashSet<&String> = user.menus
    //     .iter()
    //     .flat_map(|menu| &menu.permissions)
    //     .collect();
    //
    // required_codes.iter().all(|required| {
    //     if required == "*" {
    //         return true; // * 表示无需具体权限
    //     }
    //     user_permissions.iter().any(|&user_perm| matches_permission(required, user_perm))
    // })
}

pub async fn auth_handler(request: Request, next: Next) -> Result<Response, StatusCode> {
    // 获取目标路由的权限要求
    let permissions = request.extensions()
        .get::<Permissions>();
    info!("permissions: {:?}", permissions);
    let p = permissions.map(|p| &p.0)
        .ok_or(StatusCode::UNAUTHORIZED)?;



    let request_context = request.extensions().get::<RequestContext>().expect("request context not found");
    let login_user = request.extensions().get::<LoginUserContext>().expect("login user not found");

    // 检查权限
    if !has_permission(&login_user, p) {
        return Err(StatusCode::UNAUTHORIZED);
    }

    Ok(next.run(request).await)

    // let mut req = req;
    // req.extensions_mut().insert(user);
    // let response = next.run(req).await;
    // Ok(response)
    //
    // // 验证api权限，如果不在路由表中，则放行，否则验证权限
    // if ApiUtils::is_in(&request_context.path).await {
    //     if ApiUtils::check_api_permission(&request_context.path, &request_context.method, &login_user.id).await {
    //         Ok(next.run(request).await)
    //     } else {
    //         Err(StatusCode::UNAUTHORIZED)
    //     }
    // } else {
    //     Ok(next.run(request).await)
    // }
}
