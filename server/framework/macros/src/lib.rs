extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, Expr, ItemFn, Lit, LitStr, Meta, MetaNameValue};
use syn::punctuated::Punctuated;
use syn::token::Comma;

#[proc_macro_attribute]
pub fn require_authorize(args: TokenStream, input: TokenStream) -> TokenStream {
    let args = parse_macro_input!(args with Punctuated::<MetaNameValue, Comma>::parse_terminated);
    println!("args: {:?}", args);

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
            common::middleware::authorize::register_operation_authorizes(#operation_id, vec![#(#authorizes.to_string()),*]);
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

    #[require_authorize(operation_id = "operation_id", authorize = "user:read,user:get")]
    async fn test_handler(state: AppState) -> String {
        "Hello".to_string()
    }
}
*/