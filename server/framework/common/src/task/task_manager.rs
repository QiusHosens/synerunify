use std::collections::HashMap;
use std::error::Error;
use std::sync::Arc;
use tokio::sync::mpsc;
use tokio::sync::RwLock;
use tokio::task::JoinHandle;
use tokio::time::{self, Duration};

pub trait Task: Send + Sync + 'static {
    fn execute(&self) -> Result<(), Box<dyn Error + Send + Sync>>;
    fn on_error(&self, error: Box<dyn Error + Send + Sync>) -> ErrorAction;
}

#[derive(Debug)]
pub enum ErrorAction {
    Continue,
    Retry(u64),
    Stop,
}

pub struct TaskItem {
    task: Box<dyn Task>,
    interval_secs: u64,
}

#[derive(Debug, Clone)]
pub struct TaskStatus {
    pub id: usize,
    pub last_run: Option<chrono::DateTime<chrono::Local>>,
    pub last_error: Option<String>,
    pub running: bool,
}

/// 任务管理器
pub struct TaskManager {
    task_sender: mpsc::Sender<(usize, TaskItem)>,
    remove_sender: mpsc::Sender<usize>,
    tasks: Arc<RwLock<HashMap<usize, JoinHandle<()>>>>,
    statuses: Arc<RwLock<HashMap<usize, TaskStatus>>>,
    next_id: usize,
}

impl TaskManager {
    pub fn new() -> Self {
        let (task_sender, mut task_receiver) = mpsc::channel::<(usize, TaskItem)>(100);
        let (remove_sender, mut remove_receiver) = mpsc::channel::<usize>(100);
        let tasks = Arc::new(RwLock::new(HashMap::new()));
        let statuses = Arc::new(RwLock::new(HashMap::new()));

        let tasks_clone = tasks.clone();
        let statuses_clone = statuses.clone();

        tokio::spawn(async move {
            loop {
                tokio::select! {
                    Some((id, task_item)) = task_receiver.recv() => {
                        let interval_secs = task_item.interval_secs;
                        let task = task_item.task;
                        let tasks = tasks_clone.clone();
                        let statuses = statuses_clone.clone();

                        let handle = tokio::spawn(async move {
                            let mut interval = time::interval(Duration::from_secs(interval_secs));
                            let mut last_run = None;
                            let mut last_error = None;
                            let mut running = true;

                            loop {
                                interval.tick().await;
                                match task.execute() {
                                    Ok(()) => {
                                        last_run = Some(chrono::Local::now());
                                        last_error = None;
                                    }
                                    Err(e) => {
                                        last_error = Some(e.to_string());
                                        match task.on_error(e) {
                                            ErrorAction::Continue => {}
                                            ErrorAction::Retry(delay) => {
                                                tokio::time::sleep(Duration::from_secs(delay)).await;
                                            }
                                            ErrorAction::Stop => {
                                                running = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                let mut statuses = statuses.write().await;
                                statuses.insert(id, TaskStatus {
                                    id,
                                    last_run,
                                    last_error: last_error.clone(),
                                    running,
                                });
                            }
                        });

                        let mut tasks = tasks.write().await;
                        tasks.insert(id, handle);
                        let mut statuses = statuses_clone.write().await;
                        statuses.insert(id, TaskStatus {
                            id,
                            last_run: None,
                            last_error: None,
                            running: true,
                        });
                    }
                    Some(id) = remove_receiver.recv() => {
                        let mut tasks = tasks_clone.write().await;
                        if let Some(handle) = tasks.remove(&id) {
                            handle.abort();
                        }
                        let mut statuses = statuses_clone.write().await;
                        if let Some(status) = statuses.get_mut(&id) {
                            status.running = false;
                        }
                    }
                }
            }
        });

        TaskManager {
            task_sender,
            remove_sender,
            tasks,
            statuses,
            next_id: 0,
        }
    }

    pub async fn add_task(&mut self, task: impl Task, interval_secs: u64) -> usize {
        let task_id = self.next_id;
        self.next_id += 1;

        let task_item = TaskItem {
            task: Box::new(task),
            interval_secs,
        };

        if let Err(e) = self.task_sender.send((task_id, task_item)).await {
            eprintln!("add task error: {}", e);
        } else {
            println!("add task {}, interval {} s", task_id, interval_secs);
        }
        task_id
    }

    pub async fn remove_task(&self, task_id: usize) {
        if let Err(e) = self.remove_sender.send(task_id).await {
            eprintln!("remove task error: {}", e);
        } else {
            println!("remove task {}", task_id);
        }
    }

    pub async fn get_status(&self, task_id: usize) -> Option<TaskStatus> {
        let statuses = self.statuses.read().await;
        statuses.get(&task_id).cloned()
    }

    pub fn shutdown(&self) {
        println!("task manager shutdown: {:?}", chrono::Local::now());
        let tasks = self.tasks.blocking_read();
        for (_, handle) in tasks.iter() {
            handle.abort();
        }
    }
}

impl Drop for TaskManager {
    fn drop(&mut self) {
        self.shutdown();
    }
}

// pub struct SampleTask {
//     name: String,
//     fail_count: usize,
// }
//
// impl SampleTask {
//     pub fn new(name: &str) -> Self {
//         SampleTask { name: name.to_string(), fail_count: 0 }
//     }
// }
//
// impl Task for SampleTask {
//     fn execute(&self) -> Result<(), Box<dyn Error + Send + Sync>> {
//         println!("任务 {} 执行: {:?}", self.name, chrono::Local::now());
//         if self.name.contains("fail") && self.fail_count < 2 {
//             let fail_count = self.fail_count + 1;
//             return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, format!("任务 {} 失败，第 {} 次", self.name, fail_count))));
//         }
//         Ok(())
//     }
//
//     fn on_error(&self, error: Box<dyn Error + Send + Sync>) -> ErrorAction {
//         println!("任务 {} 错误: {}", self.name, error);
//         if self.name.contains("fail") {
//             if self.fail_count < 2 {
//                 ErrorAction::Retry(2)
//             } else {
//                 ErrorAction::Stop
//             }
//         } else {
//             ErrorAction::Continue
//         }
//     }
// }


// 模拟一段时间后移除任务
// tokio::spawn(async move {
//     tokio::time::sleep(Duration::from_secs(30)).await;
//     task_manager.remove_task(task1_id).await;
//     println!("30秒后移除任务 {}", task1_id);
//
//     // 检查任务状态
//     if let Some(status) = task_manager.get_status(task1_id).await {
//         println!("任务 {} 状态: {:?}", task1_id, status);
//     }
//     if let Some(status) = task_manager.get_status(task2_id).await {
//         println!("任务 {} 状态: {:?}", task2_id, status);
//     }
// });