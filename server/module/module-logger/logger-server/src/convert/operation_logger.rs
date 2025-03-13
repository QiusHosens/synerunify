use common::base::logger::OperationLogger;
use logger_model::response::operation_logger::OperationLoggerResponse;

pub fn model_to_response(model: OperationLogger) -> OperationLoggerResponse {
    OperationLoggerResponse {
        id: model.id,
        trace_id: model.trace_id,
        user_id: model.user_id,
        user_type: model.user_type,
        r#type: model.r#type,
        sub_type: model.sub_type,
        biz_id: model.biz_id,
        action: model.action,
        success: model.success,
        extra: model.extra,
        request_method: model.request_method,
        request_url: model.request_url,
        user_ip: model.user_ip,
        user_agent: model.user_agent,
        department_code: model.department_code,
        department_id: model.department_id,
        operator: model.operator,
        operator_nickname: model.operator_nickname,
        operate_time: model.operate_time,
    }
}