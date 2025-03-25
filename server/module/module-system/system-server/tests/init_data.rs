use common::utils::crypt_utils::{encrypt_password, get_md5};

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