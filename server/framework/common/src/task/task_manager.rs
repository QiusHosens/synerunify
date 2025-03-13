use tokio::time::{self, Duration};
use tokio::sync::mpsc;
use std::error::Error;

pub trait Task: Send + 'static {
    fn execute(&self) -> Result<(), Box<dyn Error>>;
}

pub struct TaskManager {
    interval: tokio::time::Interval,
    task_sender: mpsc::Sender<Box<dyn Task>>,
    worker_handle: tokio::task::JoinHandle<()>,
}

impl TaskManager {
    pub fn new(seconds: u64) -> Self {
        let (sender, mut receiver) = mpsc::channel::<Box<dyn Task>>(100);
        let mut interval = time::interval(Duration::from_secs(seconds));

        // 跳过第一次立即触发的tick
        // interval.tick().blocking();

        let worker_handle = tokio::spawn(async move {
            while let Some(task) = receiver.recv().await {
                if let Err(e) = task.execute() {
                    eprintln!("Task execute fail: {}", e);
                }
            }
        });

        TaskManager {
            interval,
            task_sender: sender,
            worker_handle,
        }
    }

    pub async fn start(&mut self) {
        println!("Task manager start: {:?}", chrono::Local::now());

        self.interval.tick().await; // 跳过第一次tick

        loop {
            self.interval.tick().await;
            println!("Timing trigger: {:?}", chrono::Local::now());
            // 这里可以添加默认任务或触发信号
        }
    }

    pub async fn add_task(&self, task: impl Task) {
        let boxed_task = Box::new(task);
        if let Err(e) = self.task_sender.send(boxed_task).await {
            eprintln!("Add task fail: {}", e);
        }
    }

    pub fn shutdown(&self) {
        println!("Task manager shutdown: {:?}", chrono::Local::now());
        self.worker_handle.abort();
    }
}