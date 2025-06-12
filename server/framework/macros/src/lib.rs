extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn::parse::Parse;
use syn::{parse_macro_input, Expr, ItemFn, Lit, LitStr, Meta, MetaNameValue};
use syn::punctuated::Punctuated;
use syn::token::Comma;

/// 接口权限定义宏
#[proc_macro_attribute]
pub fn require_authorize(args: TokenStream, input: TokenStream) -> TokenStream {
    let args = parse_macro_input!(args with Punctuated::<MetaNameValue, Comma>::parse_terminated);
    // println!("args: {:?}", args);

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

/// 字段扩展宏
struct ExtendFieldsArgs {
    fields: Option<Vec<String>>,
}

impl Parse for ExtendFieldsArgs {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        if input.is_empty() {
            return Ok(ExtendFieldsArgs { fields: None });
        }

        let mut fields = Vec::new();
        let args = Punctuated::<syn::LitStr, Token![,]>::parse_terminated(input)?;
        for arg in args {
            fields.push(arg.value());
        }
        Ok(ExtendFieldsArgs {
            fields: Some(fields),
        })
    }
}

#[proc_macro_derive(ExtendFields, attributes(extend_fields))]
pub fn derive_extend_fields(input: TokenStream) -> TokenStream {
    // 解析输入的 AST
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;

    // 获取结构体的字段
    let fields = match input.data {
        Data::Struct(data) => match data.fields {
            Fields::Named(fields) => fields.named,
            _ => panic!("ExtendFields only supports structs with named fields"),
        },
        _ => panic!("ExtendFields only supports structs"),
    };

    // 收集需要添加额外字段的字段及其自定义字段名
    let mut extend_field_info = Vec::new();
    for field in fields.iter() {
        let field_ident = field.ident.as_ref().expect("Expected named field");
        for attr in &field.attrs {
            if attr.path().is_ident("extend_fields") {
                let args: ExtendFieldsArgs = attr.parse_args().unwrap_or(ExtendFieldsArgs { fields: None });
                let field_str = field_ident.to_string();
                let extend_fields = args.fields.unwrap_or_else(|| {
                    let first_field = if field_str.ends_with("_id") {
                        field_str[..field_str.len() - 3].to_string() + "_name"
                    } else {
                        field_str.clone() + "_name"
                    };
                    vec![
                        first_field,
                        format!("{}_is_short", field_str),
                    ]
                });
                extend_field_info.push((field_ident, extend_fields));
            }
        }
    }

    // 生成序列化逻辑
    let serialize_extend_fields = extend_field_info.iter().map(|(ident, extend_fields)| {
        let length_field = &extend_fields[0];
        let is_short_field = &extend_fields[1];
        quote! {
            map.serialize_entry(#length_field, &self.#ident.len())?;
            map.serialize_entry(#is_short_field, &(self.#ident.len() < 5))?;
        }
    });

    // 为每个字段生成序列化代码
    let serialize_fields = fields.iter().map(|field| {
        let ident = field.ident.as_ref().unwrap();
        quote! {
            map.serialize_entry(stringify!(#ident), &self.#ident)?;
        }
    });

    // 生成自定义序列化实现
    let expanded = quote! {
        impl serde::Serialize for #name {
            fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
            where
                S: serde::Serializer,
            {
                use serde::ser::SerializeMap;

                // 计算字段数量（原始字段 + 额外字段）
                let mut map = serializer.serialize_map(None)?;

                // 序列化所有原始字段
                #(#serialize_fields)*

                // 序列化额外字段
                #(#serialize_extend_fields)*

                map.end()
            }
        }
    };

    TokenStream::from(expanded)
}