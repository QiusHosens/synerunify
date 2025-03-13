use common::base::logger::LoginLogger;
use logger_model::response::login_logger::LoginLoggerResponse;

pub fn model_to_response(model: LoginLogger) -> LoginLoggerResponse {
    LoginLoggerResponse {
        id: model.id,
        trace_id: model.trace_id,
        user_id: model.user_id,
        user_type: model.user_type,
        username: model.username,
        result: model.result,
        user_ip: model.user_ip,
        user_agent: model.user_agent,
        department_code: model.department_code,
        department_id: model.department_id,
        operator: model.operator,
        operate_time: model.operate_time,
    }
}