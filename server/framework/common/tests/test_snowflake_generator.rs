// 测试代码
#[cfg(test)]
#[ignore]
mod tests {
    use common::utils::snowflake_generator::SnowflakeGenerator;

    use super::*;
    use std::sync::Arc;

    #[test]
    #[ignore]
    fn test_generate() {
        let generator = SnowflakeGenerator::new();

        // 生成并打印5个订单编号示例
        for _ in 0..5 {
            match generator.generate() {
                Ok(id) => println!("Generated order number: {:019}", id),
                Err(e) => println!("Error: {}", e),
            }
        }
    }

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

    // #[test]
    // #[ignore]
    // fn test_large_offset() {
    //     let generator = SnowflakeGenerator::new();
    //     {
    //         let mut last_ts = generator.last_timestamp.lock().unwrap();
    //         let mut offset = generator.time_offset.lock().unwrap();
    //         *last_ts = generator.timestamp_since_epoch() + 172_800_001; // 模拟超过两天偏移
    //         *offset = 172_800_001;
    //     }
    //     let result = generator.generate();
    //     assert!(result.is_err());
    //     assert_eq!(result.unwrap_err(), "Time offset too large (exceeds 2 days)");
    // }

    // #[test]
    // #[ignore]
    // fn test_concurrent_generation() {
    //     let generator = Arc::new(SnowflakeGenerator::new());
    //     let mut handles = vec![];
    //     let num_threads = 10;
    //     let ids_per_thread = 1000;
    //     let ids = Arc::new(Mutex::new(HashSet::new()));

    //     // 启动多个线程并发生成ID
    //     for _ in 0..num_threads {
    //         let generator = Arc::clone(&generator);
    //         let ids = Arc::clone(&ids);
    //         let handle = thread::spawn(move || {
    //             for _ in 0..ids_per_thread {
    //                 if let Ok(id) = generator.generate() {
    //                     let mut ids_set = ids.lock().unwrap();
    //                     ids_set.insert(id);
    //                 }
    //             }
    //         });
    //         handles.push(handle);
    //     }

    //     // 等待所有线程完成
    //     for handle in handles {
    //         handle.join().unwrap();
    //     }

    //     // 检查生成的ID数量和唯一性
    //     let ids_set = ids.lock().unwrap();
    //     assert_eq!(ids_set.len(), num_threads * ids_per_thread, "Some IDs are duplicated");
    //     assert!(ids_set.iter().all(|&id| id.to_string().len() <= 19), "Some IDs exceed 19 digits");
    // }

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