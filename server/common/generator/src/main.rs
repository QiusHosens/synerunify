use mysql::prelude::*;
use mysql::*;
use tera::{Tera, Context};
use inflections;
use std::fs::File;
use std::io::Write;
use std::path::Path;

const KEYWORDS: &[&str] = &["type"];

struct ColumnInfo {
    column_name: String,
    data_type: String,
    is_nullable: String,
    column_comment: String,
    column_key: String,
}

fn get_table_columns(conn: &mut PooledConn, table: &str) -> Vec<ColumnInfo> {
    let query = format!(
        "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT, COLUMN_KEY
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '{}'",
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
        "mediumint" => "i32",
        "int" | "integer" => "i32",
        "bigint" => "i64",

        // 浮点数类型
        "float" => "f32",
        "double" | "real" => "f64",
        "decimal" | "numeric" => "Decimal", // 需要 rust_decimal crate

        // 字符串类型
        "char" => "String",
        "varchar" => "String",
        "tinytext" => "String",
        "text" => "String",
        "mediumtext" => "String",
        "longtext" => "String",

        // 二进制类型
        "binary" => "Vec<u8>",
        "varbinary" => "Vec<u8>",
        "tinyblob" => "Vec<u8>",
        "blob" => "Vec<u8>",
        "mediumblob" => "Vec<u8>",
        "longblob" => "Vec<u8>",

        // 时间类型
        "date" => "NaiveDate",        // chrono::NaiveDate
        "time" => "NaiveTime",        // chrono::NaiveTime
        "datetime" => "NaiveDateTime", // chrono::NaiveDateTime
        "timestamp" => "DateTime<Utc>", // chrono::DateTime<Utc>

        // 布尔类型
        "boolean" => "bool",          // MySQL 用 TINYINT(1) 表示

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
fn get_column_name(column_name: String) -> String {
    if KEYWORDS.contains(&column_name.as_str()) { format!("r#{}", column_name) } else { column_name }
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
    let base_path = "common/generator/src";
    // 初始化数据库连接
    let url = "mysql://synerunify:synerunify@192.168.0.49:30010/synerunify";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    // 获取所有表名
    let tables: Vec<String> = conn.query("SHOW  TABLES").unwrap();

    // 初始化模板引擎
    let mut tera = Tera::default();
    tera.add_template_file(format!("{}/templates/model.tera", base_path),  Some("model")).unwrap();

    // 遍历表生成Model
    for table in tables {
        let columns = get_table_columns(&mut conn, &table);
        let mut context = Context::new();

        context.insert("model_name",  &format!("{}Model", inflections::case::to_pascal_case(&table)));
        context.insert("table_name",  &table);
        context.insert("columns",  &columns.into_iter().map( |c| {
            let mut map = serde_json::Map::new();
            map.insert("column_name".into(),  get_column_name(c.column_name).into());
            map.insert("rust_type".into(),  map_data_type(&c.data_type).into());
            map.insert("nullable".into(),  (c.is_nullable  == "YES").into());
            map.insert("column_comment".into(),  c.column_comment.into());
            map.insert("is_key".into(),  (c.column_key  == "PRI").into());
            map
        }).collect::<Vec<_>>());

        let code = tera.render("model",  &context).unwrap();

        let file_path = format!("{}/models/{}.rs", base_path, table);
        write_file(&file_path, &code).unwrap();
    }
}
