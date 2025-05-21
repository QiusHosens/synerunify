use std::error::Error;
use std::fmt::{Display, Formatter};

use strum_macros::{EnumIter, IntoStaticStr};

/// 自定义错误码
#[derive(Debug)]
pub enum CustomError {
    VerifyError(String), // 校验错误
    ServerError(String), // 服务器错误
}

impl Display for CustomError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            CustomError::VerifyError(msg) => write!(f, "{}", msg),
            CustomError::ServerError(msg) => write!(f, "{}", msg),
        }
    }
}

impl Error for CustomError {

}

#[derive(Debug, EnumIter, IntoStaticStr)]
#[strum(serialize_all = "lowercase")]
pub enum DeviceType {
    Pc,
    Mobile,
    Web,
}