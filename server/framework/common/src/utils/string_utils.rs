/// 根据code获取下一个code
pub fn get_next_code(parent_code: String, code: Option<String>) -> String {
    match code {
        Some(c) => {
            // 分割当前编码
            let parts: Vec<&str> = c.split('-').collect();
            // 计算父级编码的长度（按 - 分割后的部分数）
            let parent_parts: Vec<&str> = parent_code.split('-').collect();
            let parent_len = parent_parts.len();
            // 检查编码格式是否有效：总部分数应为 parent_len + 1，且前缀匹配 parent_code
            if parts.len() == parent_len + 1 && c.starts_with(&format!("{}-", parent_code)) {
                // 提取本级编号（最后一部分）
                let last_part = parts.last().unwrap();
                // 尝试解析为数字
                let num: u32 = last_part.parse().unwrap_or(0);
                // 递增并格式化为4位数字，前面补0
                format!("{}-{:04}", parent_code, num + 1)
            } else {
                // 如果格式不正确，返回第一个子编码
                format!("{}-0000", parent_code)
            }
        }
        None => {
            // 如果没有提供当前编码，返回第一个子编码
            format!("{}-0000", parent_code)
        }
    }
}