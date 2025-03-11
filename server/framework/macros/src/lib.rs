extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

#[proc_macro_attribute]
pub fn require_permissions(attr: TokenStream, item: TokenStream) -> TokenStream {
    let permissions = attr.to_string()
        .split(',')
        .map(|s| s.trim().trim_matches('"').to_string())
        .collect::<Vec<String>>();

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