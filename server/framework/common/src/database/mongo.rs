use std::sync::OnceLock;
use mongodb::{Client, Collection};
use crate::config::config::Config;

static MONGO_CLIENT: OnceLock<Client> = OnceLock::new();

pub struct MongoManager;

impl MongoManager {

    fn client() -> &'static Client {
        MONGO_CLIENT.get_or_init(|| {
            let config = Config::load();
            Client::with_uri_str(config.mongo_url.as_str()).expect("Failed to initialize Mongo Client")
        })
    }

    pub fn get_login_logger_collection<T>() -> Collection<T> {
        let mut client = Self::client();
        client.database("synerunify").collection("login_logger")
    }

    pub fn get_operation_logger_collection<T>() -> Collection<T> {
        let mut client = Self::client();
        client.database("synerunify").collection("operation_logger")
    }
}