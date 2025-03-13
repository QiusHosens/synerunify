use mongodb::{
    bson::{doc, Document},
    options::ClientOptions,
    Client, Collection,
    error::Error as MongoError,
};
use once_cell::sync::OnceCell;
use std::env;
use mongodb::bson::{from_document, to_document};
use mongodb::bson::oid::ObjectId;
use mongodb::options::FindOptions;
use serde::Deserialize;
use crate::base::logger::{LoginLogger, OperationLogger};
use crate::base::page::PaginatedResponse;
use crate::config::config::Config;

static MONGO_MANAGER: OnceCell<MongoManager> = OnceCell::new();

pub struct MongoManager {
    client: Client,
    db_name: String,
    login_collection: Collection<Document>,
    operation_collection: Collection<Document>,
}

impl MongoManager {
    /// 初始化 MongoDB 客户端并创建单例实例
    pub async fn init() -> Result<(), MongoError> {
        let config = Config::load();
        let mongo_uri = config.mongo_url;

        let client_options = ClientOptions::parse(&mongo_uri).await?;
        let client = Client::with_options(client_options)?;

        let db_name = "synerunify".to_string();
        let database = client.database(&db_name);

        let login_collection = database.collection::<Document>("login_logger");
        let operation_collection = database.collection::<Document>("operation_logger");

        let manager = Self {
            client,
            db_name,
            login_collection,
            operation_collection,
        };

        MONGO_MANAGER.set(manager).map_err(|_| {
            MongoError::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                "Failed to initialize MongoManager singleton"
            ))
        })?;

        Ok(())
    }

    /// 获取单例实例
    pub fn get() -> &'static Self {
        MONGO_MANAGER.get().expect("MongoManager is not initialized. Call MongoManager::init() first.")
    }

    /// 插入登录日志
    pub async fn insert_login_log(&self, log: LoginLogger) -> Result<String, MongoError> {
        let doc = to_document(&log)?;
        let result = self.login_collection.insert_one(doc).await?;
        Ok(result.inserted_id.to_string())
    }

    /// 插入操作日志
    pub async fn insert_operation_log(&self, log: OperationLogger) -> Result<String, MongoError> {
        let doc = to_document(&log)?;
        let result = self.operation_collection.insert_one(doc).await?;
        Ok(result.inserted_id.to_string())
    }

    /// 批量插入登录日志
    pub async fn insert_login_logs(&self, logs: Vec<LoginLogger>) -> Result<Vec<String>, MongoError> {
        let docs: Vec<Document> = logs.into_iter()
            .map(|log| to_document(&log))
            .collect::<Result<Vec<_>, _>>()?;
        let result = self.login_collection.insert_many(docs).await?;
        Ok(result.inserted_ids.into_values().map(|id| id.to_string()).collect())
    }

    /// 批量插入操作日志
    pub async fn insert_operation_logs(&self, logs: Vec<OperationLogger>) -> Result<Vec<String>, MongoError> {
        let docs: Vec<Document> = logs.into_iter()
            .map(|log| to_document(&log))
            .collect::<Result<Vec<_>, _>>()?;
        let result = self.operation_collection.insert_many(docs).await?;
        Ok(result.inserted_ids.into_values().map(|id| id.to_string()).collect())
    }

    /// 查询登录日志
    pub async fn find_login_logs(&self, filter: LoginLogger) -> Result<Vec<LoginLogger>, MongoError> {
        let doc = to_document(&filter)?;
        let mut cursor = self.login_collection.find(doc).await?;
        let mut results = Vec::new();
        while cursor.advance().await? {
            let doc = cursor.deserialize_current()?;
            let log: LoginLogger = from_document(doc)?;
            results.push(log);
        }
        Ok(results)
    }

    /// 查询操作日志
    pub async fn find_operation_logs(&self, filter: OperationLogger) -> Result<Vec<OperationLogger>, MongoError> {
        let doc = to_document(&filter)?;
        let mut cursor = self.operation_collection.find(doc).await?;
        let mut results = Vec::new();
        while cursor.advance().await? {
            let doc = cursor.deserialize_current()?;
            let log: OperationLogger = from_document(doc)?;
            results.push(log);
        }
        Ok(results)
    }

    /// 分页查询登录日志
    pub async fn find_login_logs_paginated(
        &self,
        filter: Option<LoginLogger>,
        page: u64,
        page_size: u64,
    ) -> Result<PaginatedResponse<LoginLogger>, MongoError> {
        let filter_doc = filter.map(|f| to_document(&f)).transpose()?;
        let page_result = self.find_paginated(&self.login_collection, filter_doc, page, page_size).await?;
        let mut results: Vec<LoginLogger> = Vec::new();
        for doc in page_result.list {
            let log: LoginLogger = from_document(doc)?;
            results.push(log);
        }

        Ok(PaginatedResponse {
            list: results,
            total_pages: page_result.total_pages,
            page,
            size: page_size,
            total: page_result.total,
        })
    }

    /// 分页查询操作日志
    pub async fn find_operation_logs_paginated(
        &self,
        filter: Option<OperationLogger>,
        page: u64,
        page_size: u64,
    ) -> Result<PaginatedResponse<OperationLogger>, MongoError> {
        let filter_doc = filter.map(|f| to_document(&f)).transpose()?;
        let page_result = self.find_paginated(&self.operation_collection, filter_doc, page, page_size).await?;
        let mut results: Vec<OperationLogger> = Vec::new();
        for doc in page_result.list {
            let log: OperationLogger = from_document(doc)?;
            results.push(log);
        }

        Ok(PaginatedResponse {
            list: results,
            total_pages: page_result.total_pages,
            page,
            size: page_size,
            total: page_result.total,
        })
    }

    /// 分页查询日志
    async fn find_paginated<T>(
        &self,
        collection: &Collection<Document>,
        filter: Option<Document>,
        page: u64,
        page_size: u64,
    ) -> Result<PaginatedResponse<T>, MongoError>
    where
        T: for<'de> Deserialize<'de> + Send + Sync,
    {
        let filter_doc = filter.unwrap_or_else(|| doc! {});
        // 查询总数
        let total = collection.count_documents(filter_doc.clone()).await?;
        // 计算总页数
        let total_pages = ((total as f64) / (page_size as f64)).ceil() as u64;

        let options = FindOptions::builder()
            .skip(Some(((page - 1) * page_size))) // 计算偏移量
            .limit(Some(page_size as i64)) // 设置每页大小
            .sort(doc! {"operate_time": -1}) // 按操作时间倒序
            .build();
        let mut cursor = collection.find(filter_doc).with_options(options).await?;
        let mut results = Vec::new();
        while cursor.advance().await? {
            let doc = cursor.deserialize_current()?;
            let item: T = from_document(doc)?;
            results.push(item);
        }
        Ok(PaginatedResponse {
            list: results,
            total_pages,
            page,
            size: page_size,
            total,
        })
    }

    /// 更新登录日志
    pub async fn update_login_log(
        &self,
        filter: LoginLogger,
        update: LoginLogger,
    ) -> Result<u64, MongoError> {
        let filter_doc = to_document(&filter)?;
        let update_doc = doc! {"$set": to_document(&update)?};
        let result = self.login_collection.update_one(filter_doc, update_doc).await?;
        Ok(result.modified_count)
    }

    /// 更新操作日志
    pub async fn update_operation_log(
        &self,
        filter: OperationLogger,
        update: OperationLogger,
    ) -> Result<u64, MongoError> {
        let filter_doc = to_document(&filter)?;
        let update_doc = doc! {"$set": to_document(&update)?};
        let result = self.operation_collection.update_one(filter_doc, update_doc).await?;
        Ok(result.modified_count)
    }

    /// 删除登录日志
    pub async fn delete_login_log(&self, filter: LoginLogger) -> Result<u64, MongoError> {
        let filter_doc = to_document(&filter)?;
        let result = self.login_collection.delete_one(filter_doc).await?;
        Ok(result.deleted_count)
    }

    /// 根据id批量删除登录日志
    pub async fn delete_login_logs_by_ids(&self, ids: Vec<String>) -> Result<u64, MongoError> {
        let object_ids: Vec<ObjectId> = ids.into_iter()
            .map(|id| {
                ObjectId::parse_str(&id).map_err(|e| {
                    MongoError::custom(format!("Failed to parse ObjectId: {}", e))
                })
            })
            .collect::<Result<Vec<_>, _>>()?;
        let filter = doc! {"_id": {"$in": object_ids}};
        let result = self.login_collection.delete_many(filter).await?;
        Ok(result.deleted_count)
    }

    /// 删除操作日志
    pub async fn delete_operation_log(&self, filter: OperationLogger) -> Result<u64, MongoError> {
        let filter_doc = to_document(&filter)?;
        let result = self.operation_collection.delete_one(filter_doc).await?;
        Ok(result.deleted_count)
    }

    /// 根据id批量删除操作日志
    pub async fn delete_operation_logs_by_ids(&self, ids: Vec<String>) -> Result<u64, MongoError> {
        let object_ids: Vec<ObjectId> = ids.into_iter()
            .map(|id| {
                ObjectId::parse_str(&id).map_err(|e| {
                    MongoError::custom(format!("Failed to parse ObjectId: {}", e))
                })
            })
            .collect::<Result<Vec<_>, _>>()?;
        let filter = doc! {"_id": {"$in": object_ids}};
        let result = self.operation_collection.delete_many(filter).await?;
        Ok(result.deleted_count)
    }
}

// #[tokio::main]
// async fn main() -> Result<(), Box<dyn std::error::Error>> {
//     MongoManager::init().await?;
//     let mongo = MongoManager::get();
//
//     let login_log = doc! {
//         "username": "test_user",
//         "timestamp": chrono::Utc::now().to_string(),
//         "ip": "127.0.0.1"
//     };
//     let login_id = mongo.insert_login_log(login_log).await?;
//     println!("Inserted login log with id: {}", login_id);
//
//     let operation_log = doc! {
//         "user_id": "12345",
//         "operation": "create_post",
//         "timestamp": chrono::Utc::now().to_string()
//     };
//     let operation_id = mongo.insert_operation_log(operation_log).await?;
//     println!("Inserted operation log with id: {}", operation_id);
//
//     let filter = doc! {"username": "test_user"};
//     let login_logs = mongo.find_login_logs(filter).await?;
//     println!("Found {} login logs", login_logs.len());
//
//     Ok(())
// }