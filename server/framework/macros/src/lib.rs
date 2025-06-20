extern crate proc_macro;

use proc_macro::TokenStream;
use quote::{quote, ToTokens};
use syn::parse::{Parse, ParseStream};
use syn::{parse_macro_input, parse_str, Data, DeriveInput, Expr, Fields, Ident, ItemFn, Lit, LitStr, Meta, MetaNameValue, Path, Token, Type};
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

/// 字段扩展宏,给字段扩展自定义字段,值为根据方法获取的值
#[derive(Default)]
struct ExtendFieldsArgs {
    field: Option<String>,
    fill_type: Option<String>,
    invocation: Option<Path>,
}

#[derive(Debug)]
struct SerdeAsArg {
    key: Ident,
    value: LitStr,
}

impl Parse for SerdeAsArg {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let key: Ident = input.parse()?;
        let _eq: Token![=] = input.parse()?;
        let value: LitStr = input.parse()?;
        Ok(SerdeAsArg { key, value })
    }
}

impl Parse for ExtendFieldsArgs {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let mut args = ExtendFieldsArgs::default();
        // eprintln!("Input: {:?}", input);
        if input.is_empty() {
            // eprintln!("Input is empty");
            return Ok(args);
        }

        let parsed_args = Punctuated::<syn::Meta, Token![,]>::parse_terminated(input);
        match parsed_args {
            Ok(parsed_args) => {
                // eprintln!("Parsed args: {:?}", parsed_args);
                for meta in parsed_args {
                    // eprintln!("Meta: {:?}", meta);
                    if let syn::Meta::NameValue(nv) = meta {
                        // eprintln!("NameValue: path={:?}, value={:?}", nv.path, nv.value);
                        let ident = nv.path.get_ident().ok_or_else(|| {
                            syn::Error::new_spanned(&nv.path, "Expected identifier")
                        })?;
                        match ident.to_string().as_str() {
                            "field" => {
                                if let syn::Expr::Lit(expr_lit) = &nv.value {
                                    if let syn::Lit::Str(lit) = &expr_lit.lit {
                                        args.field = Some(lit.value());
                                    } else {
                                        return Err(syn::Error::new_spanned(&nv.value, "Expected string literal for field"));
                                    }
                                } else {
                                    return Err(syn::Error::new_spanned(&nv.value, "Expected string literal for field"));
                                }
                            }
                            "fill_type" => {
                                if let syn::Expr::Lit(expr_lit) = &nv.value {
                                    if let syn::Lit::Str(lit) = &expr_lit.lit {
                                        args.fill_type = Some(lit.value());
                                    } else {
                                        return Err(syn::Error::new_spanned(&nv.value, "Expected string literal for fill_type"));
                                    }
                                } else {
                                    return Err(syn::Error::new_spanned(&nv.value, "Expected string literal for fill_type"));
                                }
                            }
                            "invocation" => {
                                if let syn::Expr::Lit(expr_lit) = &nv.value {
                                    if let syn::Lit::Str(lit) = &expr_lit.lit {
                                        args.invocation = Some(lit.parse().map_err(|_| {
                                            syn::Error::new_spanned(lit, "Invalid path for invocation")
                                        })?);
                                    } else {
                                        return Err(syn::Error::new_spanned(&nv.value, "Expected string literal for invocation"));
                                    }
                                } else {
                                    return Err(syn::Error::new_spanned(&nv.value, "Expected string literal for invocation"));
                                }
                            }
                            _ => return Err(syn::Error::new_spanned(&nv.path, "Unknown attribute")),
                        }
                    } else {
                        return Err(syn::Error::new_spanned(&meta, "Expected name-value attribute"));
                    }
                }
                Ok(args)
            }
            Err(e) => {
                eprintln!("Parse error: {:?}", e);
                Err(e)
            }
        }
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

    // 收集需要添加额外字段的字段及其参数
    let mut extend_field_info = Vec::new();
    // 收集serde_as
    let mut serde_as_field_info = Vec::new();
    for field in fields.iter() {
        let field_ident = field.ident.as_ref().expect("Expected named field");
        let field_type = &field.ty;
        // eprintln!("field {:?} ty: {:?}", field_ident, field_type);
        let is_option = is_option_type(field_type);
        for attr in &field.attrs {
            // eprintln!("field {:?} attr: {:?}", field_ident, attr);
            // eprintln!("field attr path: {:?}", attr.path());
            if attr.path().is_ident("extend_fields") {
                let args: ExtendFieldsArgs = attr.parse_args().unwrap_or_default();
                let field_str = field_ident.to_string();
                let field_name = args.field.unwrap_or_else(|| {
                    if field_str.ends_with("_id") {
                        field_str[..field_str.len() - 3].to_string() + "_name"
                    } else {
                        field_str.clone() + "_name"
                    }
                });
                let fill_type = args.fill_type.unwrap_or_else(|| "String".to_string());
                let invocation = args.invocation;
                extend_field_info.push((field_ident, field_name, fill_type, invocation, is_option));
            } else if attr.path().is_ident("serde_as") {
                // eprintln!("serde as meta {:?}", attr.meta);
                let field_name = field_ident.to_string();
                if let Meta::List(meta_list) = &attr.meta {
                    // eprintln!("serde as meta list {:?}", meta_list);
                    // 检查路径是否是 "serde_as"
                    if meta_list.path.is_ident("serde_as") {
                        // 解析 tokens，期望格式为 `as = "some::path"`
                        let tokens = &meta_list.tokens;
                        // eprintln!("serde as tokens {:?}", tokens);
                        // 解析为 SerdeAsArg
                        let parsed: Option<SerdeAsArg> = syn::parse2(tokens.clone()).ok();

                        if let Some(parsed_arg) = parsed { // 使用 if let Some(...) 来处理 Option
                            if parsed_arg.key == "r#as" { // serde_as 的 "as" 是关键字，需要 r#as
                                let value_path_str = parsed_arg.value.value();
                                let value_path: Path = parse_str(&value_path_str)
                                    .expect("Invalid path string in serde_as attribute");
                                serde_as_field_info.push((field_ident, field_name, value_path));
                            }
                        }
                    }
                }
            }
        }
    }

    // 生成序列化逻辑
    let serialize_extend_fields = extend_field_info.iter().map(|(ident, field_name, fill_type, invocation, is_option)| {
        if let Some(invocation) = invocation {
            if *is_option {
                quote! {
                    let value = self.#ident.as_ref().map(|v| #invocation(v, #fill_type)).unwrap_or_default();
                    map.serialize_entry(#field_name, &value)?;
                }
            } else {
                quote! {
                    let value = #invocation(&self.#ident, #fill_type);
                    map.serialize_entry(#field_name, &value)?;
                }
            }
        } else {
            quote! {
                map.serialize_entry(#field_name, &self.#ident)?;
            }
        }
    });

    let serialize_serde_as = serde_as_field_info.iter().map(|(ident, field_name_str, path_to_serializer_as_type)| {
        quote! {
            let __temp_value_result: Result<serde_json::Value, S::Error> = {
                // 1. 创建一个临时的 JSON 字符串序列化器
                let mut __temp_json_string_serializer = serde_json::Serializer::new(Vec::new());
                
                // 2. 调用 serde_with 的 serialize_as 方法，将字段值序列化到临时序列化器中
                #path_to_serializer_as_type::serialize_as(&self.#ident, &mut __temp_json_string_serializer)
                    // 将 serde_with 的错误转换为 S::Error
                    .map_err(serde::ser::Error::custom)?; 

                // 3. 从临时序列化器中获取序列化后的字节
                let __temp_bytes = __temp_json_string_serializer.into_inner();
                
                // 4. 将字节转换为 String，同时处理可能的 UTF-8 转换错误
                let __temp_str = String::from_utf8(__temp_bytes)
                    // 将 UTF-8 错误转换为 S::Error
                    .map_err(serde::ser::Error::custom)?; 

                // 5. 将 JSON 字符串解析为 serde_json::Value，同时处理可能的 JSON 解析错误
                serde_json::from_str(&__temp_str)
                    // 将 serde_json::Error 转换为 S::Error
                    .map_err(serde::ser::Error::custom) 
            };
            
            // 6. 获取最终的 serde_json::Value，并将其序列化到主 Map 中
            let __serialized_value = __temp_value_result?;
            map.serialize_entry(#field_name_str, &__serialized_value)?;
        }
    });

    // 为每个字段生成序列化代码
    let serialize_fields = fields.iter().map(|field| {
        let ident = field.ident.as_ref().unwrap();
        quote! {
            map.serialize_entry(stringify!(#ident), &self.#ident)?;
        }
    });

    let original_fields_to_serialize = fields.iter().filter(|field| {
        let ident = field.ident.as_ref().unwrap();
        // Check if this field is NOT in serde_as_field_info or extend_field_info
        !serde_as_field_info.iter().any(|(i, _, _)| i == &ident)
        //  && !extend_field_info.iter().any(|(i, _, _, _, _)| i == &ident)
    }).map(|field| {
        let ident = field.ident.as_ref().unwrap();
        quote! {
            map.serialize_entry(stringify!(#ident), &self.#ident)?;
        }
    });

    // 检查字段类型是否为 Option
    fn is_option_type(ty: &Type) -> bool {
        if let Type::Path(type_path) = ty {
            if let Some(segment) = type_path.path.segments.last() {
                return segment.ident == "Option" && matches!(segment.arguments, syn::PathArguments::AngleBracketed(_));
            }
        }
        false
    }

    // 生成自定义序列化实现
    let expanded = quote! {
        // extern crate serde;
        // extern crate serde_json;
        // extern crate serde_with;

        impl serde::Serialize for #name {
            fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
            where
                S: serde::Serializer,
            {
                use serde::ser::SerializeMap;
                use serde_with::SerializeAs; 
                use serde_json; 

                // 计算字段数量（原始字段 + 额外字段）
                let mut map = serializer.serialize_map(None)?;

                // 序列化所有原始字段
                // #(#serialize_fields)*
                #(#original_fields_to_serialize)*

                // 序列化serde_as字段
                #(#serialize_serde_as)*

                // 序列化额外字段
                #(#serialize_extend_fields)*

                map.end()
            }
        }
    };

    TokenStream::from(expanded)
}

// 示例用法
/*
#[serde_as]
#[derive(Deserialize, ExtendFields)]
struct User {
    #[extend_fields(invocation = "system_common::service::system::get_user_name")]
    id: i64,
    #[extend_fields(invocation = "system_common::service::system::get_user_name")]
    user_id: i64,
    #[extend_fields(invocation = "system_common::service::system::get_user_name")]
    creator: Option<i64>,
    value: String,
    #[serde_as(as = "common::formatter::string_date_time::StringDateTime")]
    date: NaiveDateTime,
}
序列化结果：
{
  "id": 1,        
  "user_id": 1,   
  "creator": null,
  "value": "user",
  "date": "2025-06-20 02:33:05",
  "id_name": "超级管理员",
  "user_name": "超级管理员",
  "creator_name": ""
}
*/