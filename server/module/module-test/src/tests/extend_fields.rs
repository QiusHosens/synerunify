use serde::Serialize;
use macros::ExtendFields;
use serde_json::{json, Value};

pub mod common {
    pub fn get_user_name(value: &String, field_type: &str) -> String {
        format!("user: {} (type: {})", value, field_type)
    }
}

#[derive(ExtendFields)]
struct MyStruct {
    #[extend_fields(field = "user_name", field_type = "user", invocation = "common::get_user_name")]
    name: String,
    value: i32,
}

#[derive(ExtendFields)]
struct UserStruct {
    #[extend_fields]
    user_id: String,
    score: i32,
}

#[derive(ExtendFields)]
struct ExtraStruct {
    #[extend_fields(field = "custom_name", field_type = "custom", invocation = "common::get_user_name")]
    name: String,
    data: i32,
}

#[derive(ExtendFields)]
struct NoInvocationStruct {
    #[extend_fields(field = "raw_name", field_type = "raw")]
    name: String,
    data: i32,
}

#[test]
fn test_custom_field() {
    let my_struct = MyStruct {
        name: String::from("example"),
        value: 42,
    };
    let json: Value = serde_json::to_value(&my_struct).unwrap();
    let expected = json!({
        "name": "example",
        "value": 42,
        "user_name": "user: example (type: user)"
    });
    assert_eq!(json, expected);
}

#[test]
fn test_default_field_with_id() {
    let user_struct = UserStruct {
        user_id: String::from("user123"),
        score: 100,
    };
    let json: Value = serde_json::to_value(&user_struct).unwrap();
    let expected = json!({
        "user_id": "user123",
        "score": 100,
        "user_name": "user123"
    });
    assert_eq!(json, expected);
}

#[test]
fn test_custom_field_different_type() {
    let extra_struct = ExtraStruct {
        name: String::from("test"),
        data: 50,
    };
    let json: Value = serde_json::to_value(&extra_struct).unwrap();
    let expected = json!({
        "name": "test",
        "data": 50,
        "custom_name": "user: test (type: custom)"
    });
    assert_eq!(json, expected);
}

#[test]
fn test_empty_string() {
    let user_struct = UserStruct {
        user_id: String::from(""),
        score: 0,
    };
    let json: Value = serde_json::to_value(&user_struct).unwrap();
    let expected = json!({
        "user_id": "",
        "score": 0,
        "user_name": ""
    });
    assert_eq!(json, expected);
}

#[test]
fn test_short_string() {
    let my_struct = MyStruct {
        name: String::from("abc"),
        value: 10,
    };
    let json: Value = serde_json::to_value(&my_struct).unwrap();
    let expected = json!({
        "name": "abc",
        "value": 10,
        "user_name": "user: abc (type: user)"
    });
    assert_eq!(json, expected);
}

#[test]
fn test_no_invocation() {
    let no_invocation_struct = NoInvocationStruct {
        name: String::from("direct"),
        data: 60,
    };
    let json: Value = serde_json::to_value(&no_invocation_struct).unwrap();
    let expected = json!({
        "name": "direct",
        "data": 60,
        "raw_name": "direct"
    });
    assert_eq!(json, expected);
}