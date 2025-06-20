use std::collections::HashMap;

use common::config::config::Config;
use system_grpc::system_client::system::UserResponse;
use system_model::response::system_user::SystemUserBaseResponse;
use tokio::{runtime::Runtime, task};
use once_cell::sync::Lazy;

use crate::grpc::system::{get_department, get_user, GrpcSystemService};

pub fn get_user_name<T: ToString>(value: &T, _fill_type: &str) -> String {
    // 将泛型 T 转换为 String 并尝试解析为 i64
    let id: i64 = match value.to_string().parse() {
        Ok(id) => id,
        Err(_) => return String::new(),
    };
    // 阻塞执行异步
    let users = task::block_in_place(|| {
        let rt = tokio::runtime::Runtime::new().unwrap();
        match rt.block_on(get_user(vec![id])) {
            Ok(users) => users,
            Err(e) => {
                eprintln!("Error: {:#?}", e);
                Vec::new()
            },
        }
    });
    if users.is_empty() {
        println!("grpc get user is empty");
        return String::new();
    }
    users[0].nickname.clone()
}

pub fn get_user_names_batch<T: std::hash::Hash + Eq + ToString>(ids: Vec<T>) -> std::collections::HashMap<T, String> {
    let mut result_map = std::collections::HashMap::new();
    let user_ids: Vec<i64> = ids
        .iter()
        .filter_map(|id| id.to_string().parse::<i64>().ok())
        .collect();
    // 阻塞执行异步
    let users = task::block_in_place(|| {
        let rt = tokio::runtime::Runtime::new().unwrap();
        match rt.block_on(get_user(user_ids)) {
            Ok(users) => users,
            Err(e) => {
                eprintln!("Error: {:#?}", e);
                Vec::new()
            },
        }
    });
    let user_map: HashMap<i64, String> = users
        .into_iter()
        .map(|u| (u.id, u.nickname))
        .collect();
    for id in ids {
        let user_name = match id.to_string().parse::<i64>() {
            Ok(parsed_id) => user_map.get(&parsed_id).cloned().unwrap_or_default(),
            Err(_) => String::new(),
        };
        result_map.insert(id, user_name);
    }

    result_map
}

pub fn get_department_name<T: ToString>(value: &T, _fill_type: &str) -> String {
    // 将泛型 T 转换为 String 并尝试解析为 i64
    let id: i64 = match value.to_string().parse() {
        Ok(id) => id,
        Err(_) => return String::new(),
    };
    // 阻塞执行异步
    let departments = task::block_in_place(|| {
        let rt = tokio::runtime::Runtime::new().unwrap();
        match rt.block_on(get_department(vec![id])) {
            Ok(departments) => departments,
            Err(e) => {
                eprintln!("Error: {:#?}", e);
                Vec::new()
            },
        }
    });
    if departments.is_empty() {
        println!("grpc get department is empty");
        return String::new();
    }
    departments[0].name.clone()
}