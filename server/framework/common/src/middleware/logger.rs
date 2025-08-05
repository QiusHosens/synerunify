use chrono::Local;
use std::{fs, panic};
use std::io;
use anyhow::Context;
use axum::body::Body;
use axum::http::{Request, StatusCode};
use axum::response::{IntoResponse, Response};
use tracing::error;
use tracing_appender::rolling;
use tracing_subscriber::{fmt};
use tracing_subscriber::EnvFilter;
use tracing_subscriber::prelude::*;
use crate::config::config::Config;
use once_cell::sync::OnceCell;
use flexi_logger::{Logger, FileSpec, Criterion, Naming, Age, Cleanup, Duplicate, WriteMode};
use tracing_subscriber::fmt::SubscriberBuilder;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::Registry;
use tracing_log::LogTracer;

// 自定义时间格式器
struct LocalTimeFormatter;

impl fmt::time::FormatTime for LocalTimeFormatter {
    fn format_time(&self, w: &mut fmt::format::Writer<'_>) -> std::fmt::Result {
        write!(w, "{}", Local::now().format("%Y-%m-%d %H:%M:%S%.3f"))
    }
}

static FILE_GUARD: OnceCell<tracing_appender::non_blocking::WorkerGuard> = OnceCell::new();

pub async fn init_tracing() -> io::Result<()> {
    // "error"	只显示 error 日志
    // "warn"	显示 warn 和 error
    // "info"	显示 info、warn 和 error
    // "debug"	包括 debug、info、warn、error
    // "trace"	最详细，所有日志都输出
    let config = Config::load();
    let env_filter = EnvFilter::new(format!("{}", config.log_level));

    // 配置日志文件路径
    let log_dir = "logs";
    fs::create_dir_all(log_dir).map_err(|e| {
        io::Error::new(
            io::ErrorKind::Other,
            format!("Failed to create log directory: {}", e),
        )
    })?;

    // 创建每日滚动的文件写入器，每天一个文件
    let file_appender = rolling::daily(log_dir, "app.log");

    // 配置非阻塞写入器，限制最多保存30天
    // let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);
    let (non_blocking, guard) = tracing_appender::non_blocking(file_appender);
    FILE_GUARD.set(guard).expect("Failed to set FILE_GUARD");

    let file_layer = fmt::layer()
        .with_writer(non_blocking)
        .with_ansi(false) // 文件中不需要颜色
        .with_timer(LocalTimeFormatter);

    // 配置控制台输出层
    let stdout_layer = fmt::layer()
        .with_ansi(true) // 控制台使用颜色
        .with_timer(LocalTimeFormatter);

    // 设置全局默认的 subscriber
    tracing_subscriber::registry()
        .with(file_layer)      // 输出到文件
        .with(stdout_layer)    // 输出到控制台
        .with(env_filter)      // 应用环境变量过滤
        .init();

    // 设置全局 panic hook
    panic::set_hook(Box::new(|panic_info| {
        let payload = panic_info.payload();
        let msg = if let Some(s) = payload.downcast_ref::<&str>() {
            s.to_string()
        } else if let Some(s) = payload.downcast_ref::<String>() {
            s.clone()
        } else {
            "Unknown panic payload".to_string()
        };

        let location = panic_info.location()
            .map(|l| format!("{}:{}:{}", l.file(), l.line(), l.column()))
            .unwrap_or_else(|| "unknown location".to_string());

        error!("Panic occurred at {}: {}", location, msg);
    }));

    // 清理超过30天的日志文件
    cleanup_old_logs(log_dir)?;

    Ok(())
}

pub async fn init_tracing_flexi() -> anyhow::Result<()> {
    let config = Config::load();

    Logger::try_with_str(&config.log_level)?
        .log_to_file(FileSpec::default().directory("logs").basename("app"))
        .write_mode(WriteMode::BufferAndFlush)
        .rotate(
            Criterion::AgeOrSize(Age::Day, 100 * 1024 * 1024), // 每天或100MB轮转
            Naming::Timestamps,
            Cleanup::KeepLogAndCompressedFiles(5, 30),
        )
        .duplicate_to_stdout(Duplicate::All)
        .format(flexi_logger::detailed_format)
        .start() // 初始化 log crate
        .context("初始化日志失败，可能是日志已经设置过")?;

    LogTracer::init()?; // log crate -> tracing

    tracing_subscriber::registry()
        .with(fmt::layer().with_target(false)) // 控制台日志格式
        .init();

    Ok(())
}

// 清理超过30天的日志文件
fn cleanup_old_logs(log_dir: &str) -> io::Result<()> {
    let now = Local::now();
    for entry in fs::read_dir(log_dir)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_file() {
            if let Ok(metadata) = entry.metadata() {
                if let Ok(modified) = metadata.modified() {
                    let age = now.signed_duration_since(chrono::DateTime::<Local>::from(modified));
                    if age.num_days() > 30 {
                        fs::remove_file(&path).map_err(|e| {
                            io::Error::new(
                                io::ErrorKind::Other,
                                format!("Failed to remove old log file {}: {}", path.display(), e),
                            )
                        })?;
                    }
                }
            }
        }
    }
    Ok(())
}

// 自定义异常处理中间件
pub async fn panic_handler(req: Request<Body>, next: axum::middleware::Next) -> impl IntoResponse {
    // 将异步调用包装在 catch_unwind 中
    let result = panic::catch_unwind(panic::AssertUnwindSafe(|| async move {
        next.run(req).await
    }));

    match result {
        Ok(future) => {
            // 等待异步结果
            future.await
        }
        Err(panic_error) => {
            let msg = if let Some(s) = panic_error.downcast_ref::<&str>() {
                s.to_string()
            } else if let Some(s) = panic_error.downcast_ref::<String>() {
                s.clone()
            } else {
                "Unknown panic error".to_string()
            };
            error!("Caught panic in request handler: {}", msg);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}