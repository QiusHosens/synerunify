use common::config::config::Config;
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