use bcrypt::{hash, verify, BcryptError, DEFAULT_COST};

pub fn get_md5(str : &str) -> String {
    format!("{:x}", md5::compute(str))
}

pub fn encrypt_password(password: String) -> Result<String, BcryptError> {
    hash(get_md5(password.as_str()), DEFAULT_COST)
}

pub fn verify_password(password: String, hashed: String) -> Result<bool, BcryptError> {
    verify(get_md5(password.as_str()), hashed.as_str())
}