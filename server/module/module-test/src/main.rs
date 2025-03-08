use axum::{
    extract::{State, Json, Extension},
    http::StatusCode,
    response::IntoResponse,
    Router,
    routing::put,
};
use axum::http::Request;
use axum::middleware::Next;
use axum::response::Response;
use axum::routing::post;
use serde::Deserialize;
use utoipa::OpenApi;

#[derive(Deserialize, Debug, Clone)]
struct LoginUserContext {
    id: String,
    username: String,
}

#[derive(Deserialize, Debug, utoipa::ToSchema)]
struct UpdateSystemDataScopeRuleRequest {
    rule_id: String,
    scope: String,
}

#[derive(Clone)]
struct AppState {}

#[utoipa::path(
    post,
    path = "/update",
    request_body = UpdateSystemDataScopeRuleRequest,
    responses(
        (status = 204, description = "Update successful"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
async fn update(
    State(_state): State<AppState>,
    Json(payload): Json<UpdateSystemDataScopeRuleRequest>,
    // Extension(user): Extension<LoginUserContext>,
    // req: Request<axum::body::Body>,
) -> Result<impl IntoResponse, StatusCode> {
    // let user = req.extensions().get::<LoginUserContext>();
    // if user.is_none() {
    //     return Err(StatusCode::UNAUTHORIZED);
    // }
    // let payload = req.body()
    // println!("User: {:?}", user);
    // println!("User: {:?}, Payload: {:?}", user, payload);
    Ok(StatusCode::NO_CONTENT)
}

#[derive(OpenApi)]
#[openapi(paths(update))]
struct ApiDoc;

// 中间件：指定具体的 Body 类型
async fn auth_middleware(req: Request<axum::body::Body>, next: Next) -> Result<impl IntoResponse, StatusCode> {
    let (mut parts, body) = req.into_parts();
    let login_user = LoginUserContext {
        id: "123".to_string(),
        username: "alice".to_string(),
    };
    parts.extensions.insert(login_user);
    let req = Request::from_parts(parts, body);
    Ok(next.run(req).await)
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let state = AppState {};
    let app = Router::new()
        .route("/update", post(update)) // 使用 Axum 原生路由
        .layer(axum::middleware::from_fn(auth_middleware))
        .with_state(state)
        .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger-ui").url("/api-doc.json", ApiDoc::openapi()))
    ;

    // let app = axum::Router::new().merge(router);
    let listener = tokio::net::TcpListener::bind(&"127.0.0.1:3100").await?;
    axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()).await?;
    Ok(())
    // axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
    //     .serve(app.into_make_service())
    //     .await
    //     .unwrap();
}