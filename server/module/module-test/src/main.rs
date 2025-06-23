use std::collections::HashMap;
use std::sync::{Arc, Mutex};
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
use axum::routing::{get, post, MethodRouter};
use chrono::{Local, NaiveDateTime};
use serde::{Deserialize, Serialize};
use tokio::task;
use tracing::info;
use utoipa::OpenApi;
use macros::{require_authorize, ExtendFields};
use once_cell::sync::Lazy;
use ctor;
use dashmap::DashMap;
use system_common::service::system::get_user_name;
use serde_with::{serde_as, DisplayFromStr, SerializeAs};
use common::formatter::string_date_time::StringDateTime;
// use serde_with::{serde_as, chrono::NaiveDateTime as ChronoNaiveDateTime, formats::Strftime};

mod tests;

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
// #[require_permissions("user:read")]
// #[require_authorize(operation_id = "operation_id", authorize = "user:read,user:get")]
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

#[utoipa::path(
    get,
    path = "/user",
    responses(
        (status = 204, description = "Update successful"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error")
    )
)]
// #[require_permissions("user:read,user:get")]
// #[require_authorize(operation_id = "operation_id", authorize = "user:read,user:get")]
async fn user() -> String {
    "User data".to_string()
}

#[derive(OpenApi)]
#[openapi(paths(update, user))]
struct ApiDoc;

// 全局静态变量存储路由和权限的映射
pub static ROUTE_PERMISSIONS: Lazy<DashMap<String, Vec<String>>> = Lazy::new(|| {
    DashMap::new()
});

// 注册路由权限的函数
pub fn register_operation_permissions(operation_id: &str, permissions: Vec<String>) {
    println!("Registering operation id: {} with permissions: {:?}", operation_id, permissions);
    // let mut route_permissions = ROUTE_PERMISSIONS.lock().unwrap();
    // route_permissions.insert(route.to_string(), permissions);
    ROUTE_PERMISSIONS.insert(operation_id.to_string(), permissions);
}

#[derive(Clone)]
pub struct RequiredPermissions(pub Vec<String>);

pub async fn auth_handler(request: axum::extract::Request, next: Next) -> Result<impl IntoResponse, StatusCode> {
    // let permissions = request.extensions()
    //     .get::<Permissions>();
    // let route_permissions = request.extensions().get::<Vec<String>>().cloned().unwrap_or_default();
    // let required_perms = required.0;
    let path = request.uri().path().to_string();
    // let route_permissions = ROUTE_PERMISSIONS.lock().unwrap();
    // info!("permissions: {:?}", route_permissions);
    println!("permissions: {:?}", path);
    println!("permissions: {:?}", ROUTE_PERMISSIONS);
    Ok(next.run(request).await)
}

// 中间件：指定具体的 Body 类型
async fn auth_middleware(req: Request<axum::body::Body>, next: Next) -> Result<Response, StatusCode> {
    let (mut parts, body) = req.into_parts();
    let login_user = LoginUserContext {
        id: "123".to_string(),
        username: "alice".to_string(),
    };
    parts.extensions.insert(login_user);
    let req = Request::from_parts(parts, body);
    Ok(next.run(req).await)
}

mod common_local {
    use tokio::{runtime::Runtime, task};
    use once_cell::sync::Lazy;

    pub fn get_user_name<T: ToString>(value: &T, fill_type: &str) -> String {
        // let rt = Runtime::new().unwrap();
        // format!("user: {} (type: {})", value.to_string(), fill_type)
        // let rt = Runtime::new().unwrap();
        // let g = rt.block_on(get());
        // let g = tokio::runtime::Handle::current().block_on(get());
        // 创建独立运行时
        let rt = Runtime::new().unwrap();
        // 阻塞执行异步 get
        let g = rt.block_on(get());
        format!("user: {} (type: {}), g: {}", value.to_string(), fill_type, g)
    }

    // 全局 Runtime
    static RT: Lazy<Runtime> = Lazy::new(|| {
        Runtime::new().expect("Failed to create Tokio runtime")
    });

    pub fn get_user<T: ToString>(value: &T, fill_type: &str) -> String {
        // 在同步函数中安全运行阻塞操作
        let g = task::block_in_place(|| {
            let rt = tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime");
            rt.block_on(get())
        });
        format!("user: {} (type: {}), g: {}", value.to_string(), fill_type, g)
    }

    pub async fn get() -> String {
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        "async".to_string()
    }
}

// #[derive(ExtendFields)]
// struct MyStruct {
//     #[extend_fields(field = "user_name", fill_type = "user", invocation = "common_local::get_user_name")]
//     name: String,
//     value: i32,
// }

// #[derive(ExtendFields)]
// struct UserStruct {
//     #[extend_fields]
//     user_id: String,
//     score: i32,
// }

// #[derive(ExtendFields)]
// struct ExtraStruct {
//     #[extend_fields(field = "custom_name", fill_type = "custom", invocation = "common_local::get_user_name")]
//     name: String,
//     data: i32,
// }

// #[derive(ExtendFields)]
// struct NoInvocationStruct {
//     #[extend_fields(field = "raw_name", fill_type = "raw")]
//     name: String,
//     data: i32,
// }

// #[derive(ExtendFields)]
// struct NumberStruct {
//     #[extend_fields(field = "number_name", fill_type = "number", invocation = "common_local::get_user_name")]
//     id: i64,
//     count: i32,
// }

// #[serde_as]
// // #[extend_fields]
// #[derive(Deserialize, ExtendFields)]
// // #[derive(Deserialize, Serialize)]
// struct ByteStruct {
//     #[extend_fields(field = "byte_name", fill_type = "byte", invocation = "common_local::get_user")]
//     code: i8,
//     flag: bool,
//     #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
//     date: NaiveDateTime,
// }

// #[serde_as]
// #[derive(Deserialize, Serialize, ExtendFields, Clone, Copy)]
// #[derive(ExtendFields, Serialize)]
// struct ByteStruct {
//     #[extend_fields(field = "byte_name", fill_type = "user", invocation = "common_local::get_user")]
//     code: i8,
//     flag: bool,
//     // #[serde_as(as = "ChronoNaiveDateTime<Strftime>")]
//     // #[serde_with(format = "%Y-%m-%d %H:%M:%S")]
//     // #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
//     date: NaiveDateTime,
// }

#[serde_as]
#[derive(Deserialize, ExtendFields, Clone)]
struct User {
    #[extend_fields(invocation = "system_common::service::system::get_user_names_batch")]
    id: i64,
    #[extend_fields(invocation = "system_common::service::system::get_user_names_batch")]
    user_id: i64,
    #[extend_fields(invocation = "system_common::service::system::get_user_names_batch")]
    creator: Option<i64>,
    value: String,
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    date: NaiveDateTime,
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
// fn main() {
    // let state = AppState {};

    // let app = Router::new()
    //     .route("/update", post(update)) // 使用 Axum 原生路由
    //     .route("/user", get(user))
    //     // .layer(axum::middleware::from_fn(auth_middleware))
    //     .layer(axum::middleware::from_fn(auth_handler))
    //     .with_state(state)
    //     .merge(utoipa_swagger_ui::SwaggerUi::new("/swagger-ui").url("/api-doc.json", ApiDoc::openapi()))
    // ;

    // // let app = axum::Router::new().merge(router);
    // let listener = tokio::net::TcpListener::bind(&"127.0.0.1:3100").await?;
    // axum::serve(listener, app.into_make_service_with_connect_info::<std::net::SocketAddr>()).await?;

    // 测试普通字段名
    // let my_struct = MyStruct {
    //     name: String::from("示例"),
    //     value: 42,
    // };
    // let json = serde_json::to_string_pretty(&my_struct).unwrap();
    // println!("MyStruct JSON:\n{}", json);

    // let user_struct = UserStruct {
    //     user_id: String::from("user123"),
    //     score: 100,
    // };
    // let json = serde_json::to_string_pretty(&user_struct).unwrap();
    // println!("\nUserStruct JSON:\n{}", json);

    // let extra_struct = ExtraStruct {
    //     name: String::from("测试"),
    //     data: 50,
    // };
    // let json = serde_json::to_string_pretty(&extra_struct).unwrap();
    // println!("\nExtraStruct JSON:\n{}", json);

    // let no_invocation_struct = NoInvocationStruct {
    //     name: String::from("直接值"),
    //     data: 60,
    // };
    // let json = serde_json::to_string_pretty(&no_invocation_struct).unwrap();
    // println!("\nNoInvocationStruct JSON:\n{}", json);

    // let number_struct = NumberStruct {
    //     id: 1234567890,
    //     count: 10,
    // };
    // let json = serde_json::to_string_pretty(&number_struct).unwrap();
    // println!("\nNumberStruct JSON:\n{}", json);

    // let byte_struct = ByteStruct {
    //     code: 42,
    //     flag: true,
    //     date: Local::now().naive_utc()
    // };
    // let json = serde_json::to_string_pretty(&byte_struct).unwrap();
    // // let json = task::spawn_blocking(move || {
    // //     serde_json::to_string_pretty(&byte_struct)
    // // }).await??;
    // println!("\nByteStruct JSON:\n{}", json);

    // common::formatter::string_date_time::StringDateTime::serialize_as(source, serializer)

    let user = User {
        id: 1,
        user_id: 2,
        creator: Some(3),
        value: "user".to_string(),
        date: Local::now().naive_utc()
    };
    let json = serde_json::to_string_pretty(&user).unwrap();
    // let json = task::spawn_blocking(move || {
    //     serde_json::to_string_pretty(&user)
    // }).await??;
    println!("\nUser JSON:\n{}", json);

    // 批量序列化
    let mut users: Vec<User> = Vec::with_capacity(10);
    for index in 0..10 {
        users.push(user.clone());
    }
    let json = serde_json::to_string_pretty(&users).unwrap();
    println!("\nUsers JSON:\n{}", json);

    // // 1. 准备要序列化的 NaiveDateTime 实例
    // let current_time = NaiveDateTime::parse_from_str("2025-06-20 09:15:30", "%Y-%m-%d %H:%M:%S")
    //     .expect("解析日期时间失败");

    // // --- 手动调用 serialize_as 方法 ---
    // println!("\n--- 序列化 ---");

    // // 2. 创建一个 serde_json 序列化器实例
    // // serde_json::Serializer::new(Vec::new()) 创建了一个将数据写入到 Vec<u8> 的序列化器。
    // // 这使得我们可以在序列化完成后获取到序列化结果。
    // let mut json_serializer = serde_json::Serializer::new(Vec::new());

    // // 3. 直接调用 StringDateTime::serialize_as 方法
    // // 我们将 NaiveDateTime 引用和可变的 json_serializer 引用传递进去。
    // // StringDateTime::serialize_as 知道如何将 NaiveDateTime 转换为特定字符串，
    // // 并通过 json_serializer 将其写入。
    // StringDateTime::serialize_as(&current_time, &mut json_serializer)
    //     .expect("调用 StringDateTime::serialize_as 失败");

    // // 4. 从序列化器中提取结果
    // // into_inner() 方法会返回序列化器内部的数据（这里是 Vec<u8>）。
    // let serialized_bytes = json_serializer.into_inner();
    // let serialized_string = String::from_utf8(serialized_bytes)
    //     .expect("将序列化字节转换为 UTF-8 字符串失败");

    // println!("手动调用 serialize_as 的结果 (JSON 字符串): {}", serialized_string);
    // // 预期输出： "2025-06-20 09:15:30" (注意，这是一个带引号的 JSON 字符串)

    Ok(())
}