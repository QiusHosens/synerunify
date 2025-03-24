use std::fmt::Debug;
use axum::body::Body;
use axum::http::{header, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use serde::Serialize;
use utoipa::ToSchema;

/// 系统统一返回
#[derive(Debug, Serialize, Default, ToSchema)]
pub struct CommonResult<T> {
    pub code: Option<i32>,
    pub data: Option<T>,
    pub message: Option<String>,
}

/// 填入到extensions中的数据
#[derive(Debug, Clone)]
pub struct CommonResultJsonString(pub String);

#[allow(unconditional_recursion)]
impl<T> IntoResponse for CommonResult<T>
where
    T: Serialize + Send + Sync + Debug + 'static,
{
    fn into_response(self) -> Response {
        let data = Self {
            code: self.code,
            data: self.data,
            message: self.message,
        };
        let json_string = match serde_json::to_string(&data) {
            Ok(v) => v,
            Err(e) => {
                return Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header(header::CONTENT_TYPE, HeaderValue::from_static(mime::TEXT_PLAIN_UTF_8.as_ref()))
                    .body(Body::from(e.to_string()))
                    .unwrap();
            }
        };
        let res_json_string = CommonResultJsonString(json_string.clone());
        let mut response = json_string.into_response();
        response.extensions_mut().insert(res_json_string);
        response
    }
}

impl<T: Serialize> CommonResult<T> {

    pub fn with_none() -> Self {
        Self {
            code: Some(200),
            data: None,
            message: Some("success".to_string()),
        }
    }

    pub fn with_data(data: T) -> Self {
        Self {
            code: Some(200),
            data: Some(data),
            message: Some("success".to_string()),
        }
    }
    pub fn with_err(err: &str) -> Self {
        Self {
            code: Some(500),
            data: None,
            message: Some(err.to_string()),
        }
    }
    pub fn with_msg(message: &str) -> Self {
        Self {
            code: Some(200),
            data: None,
            message: Some(message.to_string()),
        }
    }
    #[allow(dead_code)]
    pub fn with_data_msg(data: T, message: &str) -> Self {
        Self {
            code: Some(200),
            data: Some(data),
            message: Some(message.to_string()),
        }
    }
}