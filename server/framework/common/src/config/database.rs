use lazy_static::lazy_static;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::OnceCell;

lazy_static! {
    static ref DATABASE_INSTANCE: OnceCell<Arc<DatabaseConnection>> = OnceCell::new();
}

pub async fn get_database_instance(database_url: String) -> Arc<DatabaseConnection> {
    DATABASE_INSTANCE
        .get_or_init(|| async {
            let mut opt = ConnectOptions::new(&database_url);
            opt.max_connections(1000)
                .min_connections(5)
                .connect_timeout(Duration::from_secs(8))
                .idle_timeout(Duration::from_secs(8))
                .sqlx_logging(true);

            let conn = Database::connect(opt)
                .await
                .expect("Failed to initialize database connection");
            Arc::new(conn)
        })
        .await
        .clone()
}