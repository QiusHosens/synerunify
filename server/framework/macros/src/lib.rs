extern crate proc_macro;

// use proc_macro::TokenStream;
// use proc_macro2::TokenStream as TokenStream2;
// use quote::quote;
// use syn::{parse_macro_input, ItemFn, LitStr};

// 将权限解析逻辑改为使用 proc_macro2::TokenStream
// fn parse_permissions(attr: TokenStream2) -> Vec<String> {
//     attr.to_string()
//         .split(',')
//         .map(|s| s.trim().trim_matches('"').to_string())
//         .collect()
// }

// #[proc_macro_attribute]
// pub fn require_permissions(attr: TokenStream, item: TokenStream) -> TokenStream {
//     // 将 proc_macro::TokenStream 转换为 proc_macro2::TokenStream
//     let attr2: TokenStream2 = attr.into();
//     let permissions = parse_permissions(attr2);
//
//     let input = parse_macro_input!(item as ItemFn);
//     let fn_name = &input.sig.ident;
//     let fn_body = &input.block;
//     let fn_vis = &input.vis;
//     let fn_async = &input.sig.asyncness;
//     let fn_inputs = &input.sig.inputs;
//     let fn_output = &input.sig.output;
//
//     let wrapper_name = syn::Ident::new(&format!("{}_with_permissions", fn_name), fn_name.span());
//
//     let expanded = quote! {
//         #fn_vis #fn_async fn #fn_name(#fn_inputs) #fn_output {
//             #fn_body
//         }
//
//         #[allow(non_upper_case_globals)]
//         pub fn #wrapper_name() -> axum::routing::MethodRouter<crate::AppState> {
//             use axum::routing::get;
//             get(#fn_name)
//                 .with_metadata(vec![#(#permissions.to_string()),*])
//         }
//     };
//
//     TokenStream::from(expanded)
// }


use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, Expr, ItemFn, Lit, LitStr, Meta, MetaNameValue};
use syn::punctuated::Punctuated;
use syn::token::Comma;

#[proc_macro_attribute]
pub fn require_permissions(args: TokenStream, input: TokenStream) -> TokenStream {
    let args = parse_macro_input!(args with Punctuated::<MetaNameValue, Comma>::parse_terminated);
    println!("args: {:?}", args);
    // 解析权限字符串
    // let args = parse_macro_input!(args as LitStr);
    // let permissions: Vec<String> = args
    //     .value()
    //     .split(',')
    //     .map(|s| s.trim().to_string())
    //     .collect();

    // 提取 operation_id 和 authorize 参数
    let mut operation_id = String::new();
    let mut authorizes = Vec::new();

    for arg in args {
        if arg.path.is_ident("operation_id") {
            if let Expr::Lit(expr_lit) = &arg.value {
                if let Lit::Str(lit) = &expr_lit.lit {
                    operation_id = lit.value();
                }
            }
        } else if arg.path.is_ident("authorize") {
            if let Expr::Lit(expr_lit) = &arg.value {
                if let Lit::Str(lit) = &expr_lit.lit {
                    authorizes = lit.value()
                        .split(',')
                        .map(|s| s.trim().to_string())
                        .collect();
                }
            }
        }
    }

    // 解析函数名
    let item_fn = parse_macro_input!(input as ItemFn);
    let fn_name = item_fn.sig.ident.clone();
    let fn_name_str = fn_name.to_string();

    // 构造路由路径（假设为 "/{函数名}"）
    let route_path = format!("/{}", fn_name_str);

    // 生成唯一的注册函数名
    let register_fn_name = syn::Ident::new(
        &format!("{}_register_permissions", fn_name),
        fn_name.span()
    );

    // 生成注册代码
    let expanded = quote! {
        #item_fn

        // 在模块初始化时注册权限
        #[ctor::ctor]
        fn #register_fn_name() {
            crate::register_route_permissions(#operation_id, vec![#(#authorizes.to_string()),*]);
        }
    };

    TokenStream::from(expanded)
}


// 示例用法
/*
#[cfg(test)]
mod example {
    use super::*;

    struct AppState;

    #[require_permissions("read")]
    async fn test_handler(state: AppState) -> String {
        "Hello".to_string()
    }
}
*/

// 测试模块
// #[cfg(test)]
// mod tests {
//     use super::*;
//     use quote::quote;
//
//     #[test]
//     fn test_parse_permissions_single() {
//         let attr = quote! { "read" };
//         let permissions = parse_permissions(attr);
//         assert_eq!(permissions, vec!["read"]);
//     }
//
//     #[test]
//     fn test_parse_permissions_multiple() {
//         let attr = quote! { "read", "write" };
//         let permissions = parse_permissions(attr);
//         assert_eq!(permissions, vec!["read", "write"]);
//     }
//
//     #[test]
//     fn test_parse_permissions_empty() {
//         let attr = quote! {};
//         let permissions = parse_permissions(attr);
//         assert_eq!(permissions, Vec::<String>::new());
//     }
//
//     #[test]
//     fn test_parse_permissions_with_spaces() {
//         let attr = quote! { "read" , "write" };
//         let permissions = parse_permissions(attr);
//         assert_eq!(permissions, vec!["read", "write"]);
//     }
// }
//
// // 为测试定义一个简单的 AppState stub
// #[cfg(test)]
// struct AppState;