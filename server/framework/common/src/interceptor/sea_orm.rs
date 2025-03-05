// id拦截器,生成snowflake id
pub mod id_interceptor {
    use sea_orm::{Statement, DbBackend, Value};
    use snowflake::ProcessUniqueId;
    use std::sync::Mutex;

    // 全局 ProcessUniqueId 生成器
    lazy_static::lazy_static! {
        static ref ID_GENERATOR: Mutex<ProcessUniqueId> = Mutex::new(ProcessUniqueId::new());
    }

    pub struct IdInterceptor;

    impl StatementInterceptor for IdInterceptor {
        fn intercept(&self, stmt: Statement, _db_backend: DbBackend) -> Result<Statement, sea_orm::DbErr> {
            // 只拦截 INSERT 语句
            if stmt.sql.to_lowercase().starts_with("insert") {
                let mut new_values = stmt.values.clone().unwrap_or_default();
                // 为 id 字段添加 ProcessUniqueId 生成的 ID
                let unique_id = {
                    let mut id_generator = ID_GENERATOR.lock().unwrap();
                    id_generator.next_id() // 使用 next_id 方法生成 ID
                };
                new_values.insert(0, Value::BigInt(Some(unique_id))); // 在值列表开头插入 ID
                Ok(Statement {
                    values: Some(new_values),
                    ..stmt
                })
            } else {
                Ok(stmt)
            }
        }
    }
}