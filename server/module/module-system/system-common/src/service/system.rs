use common::config::config::Config;
use tokio::runtime::Runtime;

use crate::grpc::system::GrpcSystemService;

pub fn get_user_name<T: ToString>(value: &T, fill_type: &str) -> String {
  // 将泛型 T 转换为 String 并尝试解析为 i64
    let id: i64 = match value.to_string().parse() {
        Ok(id) => id,
        Err(_) => return String::new(),
    };
    // 创建独立运行时
    let rt = Runtime::new().unwrap();
    let service = match rt.block_on(GrpcSystemService::new()) {
        Ok(service) => service,
        Err(_) => return String::new(),
    };
    // 阻塞执行异步
    let mut service = service;
    let users = match rt.block_on(service.get_user(vec![id])) {
        Ok(users) => users,
        Err(_) => Vec::new(),
    };
    if users.is_empty() {
        return String::new();
    }
    users[0].nickname.clone()
}

