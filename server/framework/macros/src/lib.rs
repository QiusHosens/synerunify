extern crate proc_macro;

use proc_macro::TokenStream;
use proc_macro2::TokenStream as TokenStream2;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

// 将权限解析逻辑改为使用 proc_macro2::TokenStream
fn parse_permissions(attr: TokenStream2) -> Vec<String> {
    attr.to_string()
        .split(',')
        .map(|s| s.trim().trim_matches('"').to_string())
        .collect()
}

#[proc_macro_attribute]
pub fn require_permissions(attr: TokenStream, item: TokenStream) -> TokenStream {
    // 将 proc_macro::TokenStream 转换为 proc_macro2::TokenStream
    let attr2: TokenStream2 = attr.into();
    let permissions = parse_permissions(attr2);

    let input = parse_macro_input!(item as ItemFn);
    let fn_name = &input.sig.ident;
    let fn_body = &input.block;
    let fn_vis = &input.vis;
    let fn_async = &input.sig.asyncness;
    let fn_inputs = &input.sig.inputs;
    let fn_output = &input.sig.output;

    let wrapper_name = syn::Ident::new(&format!("{}_with_permissions", fn_name), fn_name.span());

    let expanded = quote! {
        #fn_vis #fn_async fn #fn_name(#fn_inputs) #fn_output {
            #fn_body
        }

        #[allow(non_upper_case_globals)]
        pub fn #wrapper_name() -> axum::routing::MethodRouter<crate::AppState> {
            use axum::routing::get;
            get(#fn_name)
                .with_metadata(vec![#(#permissions.to_string()),*])
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
#[cfg(test)]
mod tests {
    use super::*;
    use quote::quote;

    #[test]
    fn test_parse_permissions_single() {
        let attr = quote! { "read" };
        let permissions = parse_permissions(attr);
        assert_eq!(permissions, vec!["read"]);
    }

    #[test]
    fn test_parse_permissions_multiple() {
        let attr = quote! { "read", "write" };
        let permissions = parse_permissions(attr);
        assert_eq!(permissions, vec!["read", "write"]);
    }

    #[test]
    fn test_parse_permissions_empty() {
        let attr = quote! {};
        let permissions = parse_permissions(attr);
        assert_eq!(permissions, Vec::<String>::new());
    }

    #[test]
    fn test_parse_permissions_with_spaces() {
        let attr = quote! { "read" , "write" };
        let permissions = parse_permissions(attr);
        assert_eq!(permissions, vec!["read", "write"]);
    }
}

// 为测试定义一个简单的 AppState stub
#[cfg(test)]
struct AppState;