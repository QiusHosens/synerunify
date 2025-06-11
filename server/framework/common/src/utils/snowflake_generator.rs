use chrono::{DateTime, TimeZone, Utc};
use std::sync::atomic::{AtomicU16, Ordering};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use std::thread;
use std::collections::HashSet;

// 雪花算法ID生成器
pub struct SnowflakeGenerator {
    machine_id: u16, // 机器ID (0-1023)
    sequence: AtomicU16, // 序列号
    last_timestamp: Mutex<i64>, // 上次时间戳
    time_offset: Mutex<i64>, // 时间偏移量（毫秒）
    epoch: DateTime<Utc>, // 自定义纪元
}

impl SnowflakeGenerator {
    // 无参构造函数，默认machine_id为1
    pub fn new() -> Self {
        Self::new_with_machine_id(1).unwrap()
    }

    // 带machine_id的构造函数
    pub fn new_with_machine_id(machine_id: u16) -> Result<Self, &'static str> {
        if machine_id >= 1024 {
            return Err("Machine ID must be less than 1024");
        }
        Ok(SnowflakeGenerator {
            machine_id,
            sequence: AtomicU16::new(0),
            last_timestamp: Mutex::new(0),
            time_offset: Mutex::new(0),
            epoch: Utc.with_ymd_and_hms(2025, 1, 1, 0, 0, 0).unwrap(),
        })
    }

    // 获取当前时间戳（毫秒）
    fn timestamp_ms(&self) -> i64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("Time went backwards")
            .as_millis() as i64
    }

    // 获取相对于纪元的时间戳（毫秒）
    fn timestamp_since_epoch(&self) -> i64 {
        let epoch_ms = self.epoch.timestamp_millis();
        self.timestamp_ms() - epoch_ms
    }

    // 获取调整后的时间戳
    fn get_adjusted_timestamp(&self) -> Result<i64, &'static str> {
        let mut last_ts = self.last_timestamp.lock().unwrap();
        let mut offset = self.time_offset.lock().unwrap();
        let current_ts = self.timestamp_since_epoch();

        let adjusted_ts = if current_ts < *last_ts {
            // 时钟回退，借用未来时间
            *last_ts + 1
        } else {
            // 时钟正常，尝试减少偏移量
            let new_ts = current_ts + *offset;
            if new_ts > *last_ts {
                new_ts
            } else {
                *last_ts + 1
            }
        };

        // 更新偏移量
        *offset = adjusted_ts - current_ts;
        if *offset > 172_800_000 {
            // 最大偏移量限制为两天（172,800,000毫秒）
            return Err("Time offset too large (exceeds 2 days)");
        }

        // 更新最后时间戳
        *last_ts = adjusted_ts;
        Ok(adjusted_ts)
    }

    // 生成订单编号
    pub fn generate(&self) -> Result<i64, &'static str> {
        let timestamp = self.get_adjusted_timestamp()?;

        let seq = if timestamp == *self.last_timestamp.lock().unwrap() {
            // 同一毫秒，增加序列号
            self.sequence.fetch_add(1, Ordering::SeqCst) & 0xFFF
        } else {
            // 新毫秒，重置序列号
            self.sequence.store(0, Ordering::SeqCst);
            0
        };

        if seq >= 4096 {
            // 序列号溢出，使用下一时间戳
            let next_ts = self.get_adjusted_timestamp()?;
            if next_ts == timestamp {
                return Err("Sequence overflow and timestamp not advanced");
            }
            self.sequence.store(0, Ordering::SeqCst);
            // 构造ID: 41位时间戳 + 10位机器ID + 12位序列号
            let id = ((next_ts as u64 & 0x1FFFFFFFFFF) << 22)
                | ((self.machine_id as u64 & 0x3FF) << 12)
                | (0 as u64);
            return Ok(id as i64);
        }

        // 构造ID: 41位时间戳 + 10位机器ID + 12位序列号
        let id = ((timestamp as u64 & 0x1FFFFFFFFFF) << 22)
            | ((self.machine_id as u64 & 0x3FF) << 12)
            | (seq as u64);

        Ok(id as i64)
    }
}

// 测试代码
#[cfg(test)]
#[ignore]
mod tests {
    use super::*;
    use std::sync::Arc;

    #[test]
    #[ignore]
    fn test_order_number_format() {
        let generator = SnowflakeGenerator::new();
        let order_number = generator.generate().unwrap();

        // 检查是否为正数且长度合理 (19位以内)
        assert!(order_number > 0);
        assert!(order_number.to_string().len() <= 19);
    }

    #[test]
    #[ignore]
    fn test_unique_ids() {
        let generator = SnowflakeGenerator::new();
        let id1 = generator.generate().unwrap();
        let id2 = generator.generate().unwrap();

        // 检查ID唯一性
        assert_ne!(id1, id2);
    }

    #[test]
    #[ignore]
    fn test_large_offset() {
        let generator = SnowflakeGenerator::new();
        {
            let mut last_ts = generator.last_timestamp.lock().unwrap();
            let mut offset = generator.time_offset.lock().unwrap();
            *last_ts = generator.timestamp_since_epoch() + 172_800_001; // 模拟超过两天偏移
            *offset = 172_800_001;
        }
        let result = generator.generate();
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Time offset too large (exceeds 2 days)");
    }

    #[test]
    #[ignore]
    fn test_concurrent_generation() {
        let generator = Arc::new(SnowflakeGenerator::new());
        let mut handles = vec![];
        let num_threads = 10;
        let ids_per_thread = 1000;
        let ids = Arc::new(Mutex::new(HashSet::new()));

        // 启动多个线程并发生成ID
        for _ in 0..num_threads {
            let generator = Arc::clone(&generator);
            let ids = Arc::clone(&ids);
            let handle = thread::spawn(move || {
                for _ in 0..ids_per_thread {
                    if let Ok(id) = generator.generate() {
                        let mut ids_set = ids.lock().unwrap();
                        ids_set.insert(id);
                    }
                }
            });
            handles.push(handle);
        }

        // 等待所有线程完成
        for handle in handles {
            handle.join().unwrap();
        }

        // 检查生成的ID数量和唯一性
        let ids_set = ids.lock().unwrap();
        assert_eq!(ids_set.len(), num_threads * ids_per_thread, "Some IDs are duplicated");
        assert!(ids_set.iter().all(|&id| id.to_string().len() <= 19), "Some IDs exceed 19 digits");
    }

    #[test]
    #[ignore]
    fn test_default_machine_id() {
        let generator = SnowflakeGenerator::new();
        let order_number = generator.generate().unwrap();

        // 检查machine_id是否为1
        let machine_id = (order_number as u64 >> 12) & 0x3FF; // 提取10位机器ID
        assert_eq!(machine_id, 1, "Default machine ID should be 1");
    }
}

fn main() {
    let generator = SnowflakeGenerator::new();

    // 生成并打印5个订单编号示例
    for _ in 0..5 {
        match generator.generate() {
            Ok(id) => println!("Generated order number: {:019}", id),
            Err(e) => println!("Error: {}", e),
        }
    }
}