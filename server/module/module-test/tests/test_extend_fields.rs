// use macros::ExtendFields;
// use serde::Serialize;

// fn main() {
//     #[derive(ExtendFields)]
//     struct MyStruct {
//         #[extend_fields]
//         name: String,
//         value: i32,
//     }

//     #[derive(ExtendFields)]
//     struct UserStruct {
//         #[extend_fields(fields = "custom_length,custom_is_short")]
//         user_id: String,
//         score: i32,
//     }

//     // 测试普通字段名
//     let my_struct = MyStruct {
//         name: String::from("example"),
//         value: 42,
//     };
//     let json = serde_json::to_string_pretty(&my_struct).unwrap();
//     println!("MyStruct JSON:\n{}", json);

//     // 测试以 _id 结尾的字段名
//     let user_struct = UserStruct {
//         user_id: String::from("user123"),
//         score: 100,
//     };
//     let json = serde_json::to_string_pretty(&user_struct).unwrap();
//     println!("\nUserStruct JSON:\n{}", json);
// }
