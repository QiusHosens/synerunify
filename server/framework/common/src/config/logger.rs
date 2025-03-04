use crate::config::config::Config;
use chrono::Local;
use std::fs;
use std::io;
use tracing_appender::rolling;
use tracing_subscriber::fmt;
use tracing_subscriber::prelude::*;
use tracing_subscriber::EnvFilter;

// 自定义时间格式器
struct LocalTimeFormatter;

impl fmt::time::FormatTime for LocalTimeFormatter {
    fn format_time(&self, w: &mut fmt::format::Writer<'_>) -> std::fmt::Result {
        write!(w, "{}", Local::now().format("%Y-%m-%d %H:%M:%S%.3f"))
    }
}

pub async fn init_tracing() -> io::Result<()> {
    // 从环境变量 RUST_LOG 获取日志级别，默认为 info
    // let env_filter = EnvFilter::try_from_default_env()
    //     .unwrap_or_else(|_| EnvFilter::new("info"));
    let config = Config::load().await;
    let env_filter = EnvFilter::new(config.log_level);

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
    let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);

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

    // 清理超过30天的日志文件
    cleanup_old_logs(log_dir)?;

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