use std::collections::HashMap;
use std::error::Error;
use std::str::FromStr;
use std::sync::Arc;
use tokio::sync::mpsc;
use tokio::sync::RwLock;
use tokio::task::JoinHandle;
use tokio::time::Duration;
use cron::Schedule;
use chrono::Local;

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
    cron_expr: String,
}

#[derive(Debug, Clone)]
pub struct TaskStatus {
    pub id: usize,
    pub last_run: Option<chrono::DateTime<chrono::Local>>,
    pub last_error: Option<String>,
    pub running: bool,
}

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
                        let task = task_item.task;
                        let cron_expr = task_item.cron_expr;
                        let tasks = tasks_clone.clone();
                        let statuses = statuses_clone.clone();

                        let handle = tokio::spawn(async move {
                            let mut last_run = None;
                            let mut last_error = None;
                            let mut running = true;

                            match Schedule::from_str(&cron_expr) {
                                Ok(schedule) => {
                                    loop {
                                        let now = Local::now();
                                        if let Some(next) = schedule.after(&now).next() {
                                            let duration_until_next = (next - now).to_std().unwrap_or(Duration::from_secs(1));
                                            tokio::time::sleep(duration_until_next).await;

                                            match task.execute() {
                                                Ok(()) => {
                                                    last_run = Some(Local::now());
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
                                        } else {
                                            running = false;
                                            break;
                                        }

                                        let mut statuses = statuses.write().await;
                                        statuses.insert(id, TaskStatus {
                                            id,
                                            last_run,
                                            last_error: last_error.clone(),
                                            running,
                                        });
                                    }
                                }
                                Err(e) => {
                                    eprintln!("Invalid cron expression for task {}: {}", id, e);
                                    running = false;
                                    let mut statuses = statuses.write().await;
                                    statuses.insert(id, TaskStatus {
                                        id,
                                        last_run: None,
                                        last_error: Some(format!("Invalid cron expression: {}", e)),
                                        running,
                                    });
                                }
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

    pub async fn add_task(&mut self, task: impl Task, cron_expr: &str) -> usize {
        let task_id = self.next_id;
        self.next_id += 1;

        let task_item = TaskItem {
            task: Box::new(task),
            cron_expr: cron_expr.to_string(),
        };

        if let Err(e) = self.task_sender.send((task_id, task_item)).await {
            eprintln!("add task error: {}", e);
        } else {
            println!("add cron task {}, expression: {}", task_id, cron_expr);
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