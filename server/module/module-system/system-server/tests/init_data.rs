use std::time::Instant;
use anyhow::anyhow;
use jsonwebtoken::crypto::verify;
use common::utils::crypt_utils::{encrypt_password, get_md5, verify_pass, verify_password};

#[test]
#[ignore]
fn test_crypt() {
    let password = "123456";
    let password_md5 = get_md5(password);
    println!("password md5: {}", password_md5);
    match encrypt_password(password_md5.to_string()) {
        Ok(result) => {
            println!("encrypt: {}", result)
        }
        Err(_) => {}
    }
}

#[test]
#[ignore]
fn test_verify() {
    let start = Instant::now();
    let pass = "$2b$06$9LT5ie5dKyYTn/r3XKKwfOwKMqNiG1vb6QXf/xqtxdXX7F7NVwzQi";
    let password = "123456";
    let password_md5 = get_md5(password);
    let duration_md5 = start.elapsed();
    let is_match = match verify_password(password_md5, pass.to_string()) {
        Ok(is_match) => {
            is_match
        }
        Err(_) => {
            println!("verify error");
            false
        }
    };
    let duration_verify = start.elapsed();
    println!("verify result: {:?}", is_match);
    println!("duration, MD5: {:?}, verify: {:?}", duration_md5, duration_verify);
}