use anyhow::{Result, anyhow};
use common::base::logger::OperationLogger;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::database::mongo::MongoManager;
use logger_model::request::operation_logger::PaginatedKeywordRequest;
use logger_model::response::operation_logger::OperationLoggerResponse;
use crate::convert::operation_logger::model_to_response;

pub async fn add(operation_logger: OperationLogger) -> Result<()> {
    let mongo = MongoManager::get();
    mongo.insert_operation_log(operation_logger).await?;
    Ok(())
}

pub async fn add_batch(operation_loggers: Vec<OperationLogger>) -> Result<()> {
    let mongo = MongoManager::get();
    mongo.insert_operation_logs(operation_loggers).await?;
    Ok(())
}

pub async fn delete_batch(ids: Vec<String>) -> Result<()> {
    let mongo = MongoManager::get();
    mongo.delete_operation_logs_by_ids(ids).await?;
    Ok(())
}

pub async fn get_paginated(params: PaginatedKeywordRequest, login_user: LoginUserContext) -> Result<PaginatedResponse<OperationLoggerResponse>> {
    let mongo = MongoManager::get();
    let filter = Some(OperationLogger::with_tenant_id(login_user.tenant_id));
    let page_result = mongo.find_operation_logs_paginated(filter, params.base.page, params.base.size).await?;

    let mut results: Vec<OperationLoggerResponse> = Vec::new();
    for operation_logger in page_result.list {
        let log: OperationLoggerResponse = model_to_response(operation_logger);
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