pub const STATUS_ENABLE: i8 = 0;
pub const STATUS_DISABLE: i8 = 1;

pub fn is_enable(status: i8) -> bool {
    0 == status
}

pub fn is_disable(status: i8) -> bool {
    1 == status
}