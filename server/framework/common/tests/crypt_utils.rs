use common::utils::crypt_utils::encrypt_password;

#[test]
#[ignore]
fn test_crypt() {
    let password = "123456";
    match encrypt_password(password.to_string()) {
        Ok(result) => {
            println!("{}", result)
        }
        Err(_) => {}
    }
}