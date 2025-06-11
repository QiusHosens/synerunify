use common::utils::crypt_utils::{encrypt_password, get_md5};

#[test]
#[ignore]
fn test_crypt() {
    let password = "123456";
    let password_md5 = get_md5(password);
    match encrypt_password(password_md5.to_string()) {
        Ok(result) => {
            println!("{}", result)
        }
        Err(_) => {}
    }
}