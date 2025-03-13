use anyhow::{Result, anyhow};
use common::base::logger::LoginLogger;
use common::base::page::PaginatedResponse;
use common::database::mongo::MongoManager;
use logger_model::request::login_logger::PaginatedKeywordRequest;
use logger_model::response::login_logger::LoginLoggerResponse;
use crate::convert::login_logger::model_to_response;

pub async fn add(login_logger: LoginLogger) -> Result<()> {
    let mongo = MongoManager::get();
    mongo.insert_login_log(login_logger).await?;
    Ok(())
}

pub async fn add_batch(login_loggers: Vec<LoginLogger>) -> Result<()> {
    let mongo = MongoManager::get();
    mongo.insert_login_logs(login_loggers).await?;
    Ok(())
}

pub async fn delete_batch(ids: Vec<String>) -> Result<()> {
    let mongo = MongoManager::get();
    mongo.delete_login_logs_by_ids(ids).await?;
    Ok(())
}

pub async fn get_paginated(params: PaginatedKeywordRequest) -> Result<PaginatedResponse<LoginLoggerResponse>> {
    let mongo = MongoManager::get();
    let page_result = mongo.find_login_logs_paginated(None, params.base.page, params.base.size).await?;

    let mut results: Vec<LoginLoggerResponse> = Vec::new();
    for login_logger in page_result.list {
        let log: LoginLoggerResponse = model_to_response(login_logger);
        results.push(log);
    }

    Ok(PaginatedResponse {
        list: results,
        total_pages: page_result.total_pages,
        page: page_result.page,
        size: page_result.size,
        total: page_result.total,
    })
}