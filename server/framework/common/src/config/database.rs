use std::cell::OnceCell;
use std::sync::Arc;
use std::time::Duration;
use sea_orm::{ConnectOptions, Database, DatabaseConnection, DbErr};
use crate::config::config::Config;

static DATABASE_INSTANCE: OnceCell<Arc<DatabaseConnection>> = OnceCell::const_new();

pub async fn get_database_instance(config: &Config) -> Result<Arc<DatabaseConnection>, DbErr> {
    let db = DATABASE_INSTANCE
        .get_or_init(|| async {
            let mut opt = ConnectOptions::new(&config.database_url);
            opt.max_connections(1000)
                .min_connections(5)
                .connect_timeout(Duration::from_secs(8))
                .idle_timeout(Duration::from_secs(8))
                .sqlx_logging(true);

            let conn = Database::connect(opt).await
                .expect("Failed to initialize database connection");
            Arc::new(conn)
        })
        .await;
    Ok(db.clone())
}