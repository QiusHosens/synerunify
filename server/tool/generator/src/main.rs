use mysql::prelude::*;
use mysql::*;
use tera::{Tera, Context};
use inflections;
use std::fs::File;
use std::io::Write;
use std::path::Path;

const KEYWORDS: &[&str] = &["type"];
const CREATE_REQUEST_NOT_NEED_FIELDS: &[&str] = &["id", "creator", "create_time", "updater", "update_time", "deleted", "tenant_id"];
const UPDATE_REQUEST_NOT_NEED_FIELDS: &[&str] = &["creator", "create_time", "updater", "update_time", "deleted", "tenant_id"];
const RESPONSE_NOT_NEED_FIELDS: &[&str] = &["deleted", "tenant_id"];

struct ColumnInfo {
    column_name: String,
    data_type: String,
    is_nullable: String,
    column_comment: String,
    column_key: String,
}

fn get_table_comment(conn: &mut PooledConn, table: &str) -> Option<String> {
    let query = format!("select table_comment from information_schema.TABLES where TABLE_SCHEMA= '{}' and TABLE_NAME= '{}'", "synerunify", table);
    conn.query_first(query).unwrap()
}

fn get_table_columns(conn: &mut PooledConn, table: &str) -> Vec<ColumnInfo> {
    let query = format!(
        "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT, COLUMN_KEY
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '{}'
         ORDER BY ORDINAL_POSITION ASC",
        table
    );

    conn.query_map(query,  |(name, dtype, nullable, comment, key)| ColumnInfo {
        column_name: name,
        data_type: dtype,
        is_nullable: nullable,
        column_comment: comment,
        column_key: key
    }).unwrap()
}

fn map_data_type(mysql_type: &str) -> &'static str {
    match mysql_type.to_lowercase().as_str() {
        // 整数类型
        "tinyint" => "i8",         // 默认按有符号处理，布尔值另见注释
        "smallint" => "i16",
        "mediumint" | "int" | "integer" => "i32",
        "bigint" => "i64",

        // 浮点数类型
        "float" => "f32",
        "double" | "real" => "f64",
        "decimal" | "numeric" => "Decimal", // 需要 rust_decimal crate

        // 字符串类型
        "char" | "varchar" | "tinytext" | "text" | "mediumtext" | "longtext" => "String",

        // 二进制类型
        "binary" | "varbinary" | "tinyblob" | "blob" | "mediumblob" | "longblob" => "Vec<u8>",

        // 时间类型
        "date" => "NaiveDate",        // chrono::NaiveDate
        "time" => "NaiveTime",        // chrono::NaiveTime
        "datetime" => "NaiveDateTime", // chrono::NaiveDateTime
        "timestamp" => "DateTime<Utc>", // chrono::DateTime<Utc>

        // 布尔类型
        "boolean" | "bit" => "bool",          // MySQL 用 TINYINT(1) 表示

        // 其他类型
        "json" => "Value",            // serde_json::Value
        "enum" => "/* enum */",       // 需要手动定义 Rust 枚举
        "set" => "Vec<String>",       // 集合类型

        // 默认处理未知类型
        _ => "String",
    }
}

/**
 * 获取列名,关键字需转义
 */
fn get_column_name(column_name: &str) -> String {
    if KEYWORDS.contains(&column_name) { format!("r#{}", column_name) } else { column_name.to_string() }
}

fn write_file(file_path: &str, code: &str) -> std::io::Result<()> {
    // 将字符串路径转换为 Path 类型
    let path = Path::new(file_path);
    
    // 如果父目录不存在，可以选择创建它
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            std::fs::create_dir_all(parent)?;
        }
    }
    
    // 创建文件（如果文件已存在会被覆盖）
    let mut file = File::create(path)?;
    file.write_all(code.as_ref())
    
    // std::fs::write(path, code).unwrap();
    // Ok(())
}

fn main() {
    let base_path = "tool/generator";
    let template_base_path = format!("{}/src", base_path);
    let code_base_path = format!("{}/code", base_path);
    // 初始化数据库连接
    let url = "mysql://synerunify:synerunify@192.168.0.99:30010/synerunify";
    // let url = "mysql://synerunify:synerunify@192.168.1.18:30010/synerunify";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    // 获取所有表名
    let tables: Vec<String> = conn.query("SHOW  TABLES").unwrap();

    // 初始化模板引擎
    let mut tera = Tera::default();
    tera.add_template_file(format!("{}/templates/mod.tera", template_base_path),  Some("mod")).unwrap();

    tera.add_template_file(format!("{}/templates/model.tera", template_base_path),  Some("model")).unwrap();
    tera.add_template_file(format!("{}/templates/request.tera", template_base_path),  Some("request")).unwrap();
    tera.add_template_file(format!("{}/templates/response.tera", template_base_path),  Some("response")).unwrap();
    tera.add_template_file(format!("{}/templates/convert.tera", template_base_path),  Some("convert")).unwrap();

    tera.add_template_file(format!("{}/templates/api.tera", template_base_path),  Some("api")).unwrap();
    tera.add_template_file(format!("{}/templates/service.tera", template_base_path),  Some("service")).unwrap();
    tera.add_template_file(format!("{}/templates/route.tera", template_base_path),  Some("route")).unwrap();

    // 遍历表
    let mut mod_context = Context::new();
    let mut table_names: Vec<String> = Vec::with_capacity(tables.len());
    let mut table_info_list: Vec<serde_json::Map<String, serde_json::Value>> = Vec::with_capacity(tables.len());
    for table in tables {
        table_names.push(table.clone());

        let table_comment = get_table_comment(&mut conn, &table);
        let table_comment = table_comment.unwrap().to_string().replace("表", "");
        let mut table_info_map = serde_json::Map::new();
        table_info_map.insert("table_name".to_string(), table.clone().into());
        table_info_map.insert("table_comment".to_string(), table_comment.clone().into());
        table_info_list.push(table_info_map);

        let columns = get_table_columns(&mut conn, &table);
        let mut context = Context::new();

        context.insert("table_comment",  &table_comment);
        context.insert("model_name",  &format!("{}", inflections::case::to_pascal_case(&table)));
        context.insert("request_model_name",  &format!("{}Request", inflections::case::to_pascal_case(&table)));
        context.insert("response_model_name",  &format!("{}Response", inflections::case::to_pascal_case(&table)));
        context.insert("service_name",  &format!("{}Service", inflections::case::to_pascal_case(&table)));
        context.insert("service_name_const",  &format!("{}_SERVICE", inflections::case::to_upper_case(&table)));
        context.insert("table_name",  &table);

        let mut columns_data: Vec<serde_json::Map<String, serde_json::Value>> = Vec::with_capacity(columns.len());
        let mut columns_data_request_create: Vec<serde_json::Map<String, serde_json::Value>> = Vec::with_capacity(columns.len() - CREATE_REQUEST_NOT_NEED_FIELDS.len());
        let mut columns_data_request_update: Vec<serde_json::Map<String, serde_json::Value>> = Vec::with_capacity(columns.len() - UPDATE_REQUEST_NOT_NEED_FIELDS.len());
        let mut columns_data_response: Vec<serde_json::Map<String, serde_json::Value>> = Vec::with_capacity(columns.len() - RESPONSE_NOT_NEED_FIELDS.len());

        let mut request_has_time = false;
        let mut has_tenant_field = false;
        for c in columns {
            let mut map = serde_json::Map::new();
            let column_name = get_column_name(&c.column_name);
            map.insert("column_name".to_string(), column_name.clone().into());
            let data_type = map_data_type(&c.data_type);
            map.insert("rust_type".to_string(), data_type.into());
            map.insert("is_date".to_string(), (data_type == "NaiveDateTime").into());
            map.insert("nullable".to_string(), (c.is_nullable == "YES").into());
            map.insert("column_comment".to_string(), c.column_comment.into());
            
            let is_key = c.column_key == "PRI";
            map.insert("is_key".to_string(), is_key.into());
            
            if is_key {
                context.insert("primary_key_type", map_data_type(&c.data_type));
            }

            columns_data.push(map.clone());

            if !CREATE_REQUEST_NOT_NEED_FIELDS.contains(&c.column_name.as_str()) {
                if data_type == "NaiveDateTime" {
                    request_has_time = true;
                }
                columns_data_request_create.push(map.clone());
            }
            if !UPDATE_REQUEST_NOT_NEED_FIELDS.contains(&c.column_name.as_str()) {
                columns_data_request_update.push(map.clone());
            }
            if !RESPONSE_NOT_NEED_FIELDS.contains(&c.column_name.as_str()) {
                columns_data_response.push(map);
            }
            if column_name.clone() == "tenant_id" {
                has_tenant_field = true;
            }
        }
        
        context.insert("columns", &columns_data);
        context.insert("columns_request_create", &columns_data_request_create);
        context.insert("columns_request_update", &columns_data_request_update);
        context.insert("columns_response", &columns_data_response);

        context.insert("request_has_time", &request_has_time);
        context.insert("has_tenant_field", &has_tenant_field);

        // model
        let model_code = tera.render("model",  &context).unwrap();
        let file_path = format!("{}/model/{}.rs", code_base_path, table);
        write_file(&file_path, &model_code).unwrap();

        // request
        let request_code = tera.render("request",  &context).unwrap();
        let file_path = format!("{}/request/{}.rs", code_base_path, table);
        write_file(&file_path, &request_code).unwrap();

        // response
        let response_code = tera.render("response",  &context).unwrap();
        let file_path = format!("{}/response/{}.rs", code_base_path, table);
        write_file(&file_path, &response_code).unwrap();

        // convert
        let convert_code = tera.render("convert",  &context).unwrap();
        let file_path = format!("{}/convert/{}.rs", code_base_path, table);
        write_file(&file_path, &convert_code).unwrap();

        // api
        let api_code = tera.render("api",  &context).unwrap();
        let file_path = format!("{}/api/{}.rs", code_base_path, table);
        write_file(&file_path, &api_code).unwrap();

        // service
        let service_code = tera.render("service",  &context).unwrap();
        let file_path = format!("{}/service/{}.rs", code_base_path, table);
        write_file(&file_path, &service_code).unwrap();
    }
    mod_context.insert("table_names", &table_names);
    mod_context.insert("table_info_list", &table_info_list);
    // mod
    let mod_code = tera.render("mod",  &mod_context).unwrap();
    let file_path = format!("{}/model/mod.rs", code_base_path);
    write_file(&file_path, &mod_code).unwrap();

    // route
    let route_code = tera.render("route",  &mod_context).unwrap();
    let file_path = format!("{}/route/route.rs", code_base_path);
    write_file(&file_path, &route_code).unwrap();
}
