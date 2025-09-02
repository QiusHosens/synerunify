use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::RwLock;
use anyhow::{Result, anyhow};
use serde::{Deserialize, Serialize};
use tracing::{info, error};

/// 区域类型枚举
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum AreaType {
    /// 国家/地区
    Country = 1,
    /// 省份/州
    Province = 2,
    /// 城市
    City = 3,
    /// 区县
    District = 4,
    /// 街道/乡镇
    Street = 5,
}

impl From<i32> for AreaType {
    fn from(value: i32) -> Self {
        match value {
            1 => AreaType::Country,
            2 => AreaType::Province,
            3 => AreaType::City,
            4 => AreaType::District,
            5 => AreaType::Street,
            _ => AreaType::Country,
        }
    }
}

/// 区域信息结构
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Area {
    /// 区域ID
    pub id: i32,
    /// 区域名称
    pub name: String,
    /// 区域类型
    pub area_type: AreaType,
    /// 父级区域ID
    pub parent_id: i32,
    /// 子区域列表
    pub children: Vec<Area>,
}

/// 区域缓存管理器
pub struct AreaCache {
    /// 所有区域数据，按ID索引
    areas: Arc<RwLock<HashMap<i32, Area>>>,
    /// 区域层级树，按父级ID索引
    tree: Arc<RwLock<HashMap<i32, Vec<i32>>>>,
    /// 区域名称索引，用于模糊搜索
    name_index: Arc<RwLock<HashMap<String, Vec<i32>>>>,
}

impl AreaCache {
    /// 创建新的区域缓存实例
    pub fn new() -> Self {
        Self {
            areas: Arc::new(RwLock::new(HashMap::new())),
            tree: Arc::new(RwLock::new(HashMap::new())),
            name_index: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    /// 从CSV文件加载区域数据
    pub fn load_from_csv(&self, csv_path: &str) -> Result<()> {
        info!("Starting to load area data from: {}", csv_path);
        
        let mut reader = csv::Reader::from_path(csv_path)?;
        let mut areas = HashMap::new();
        let mut tree = HashMap::new();
        let mut name_index = HashMap::new();

        for result in reader.deserialize() {
            let record: CsvRecord = result?;
            
            let area = Area {
                id: record.id,
                name: record.name,
                area_type: AreaType::from(record.area_type),
                parent_id: record.parent_id,
                children: Vec::new(),
            };

            // 添加到区域映射
            areas.insert(area.id, area.clone());
            
            // 构建层级树
            tree.entry(area.parent_id)
                .or_insert_with(Vec::new)
                .push(area.id);
            
            // 构建名称索引
            name_index.entry(area.name.clone())
                .or_insert_with(Vec::new)
                .push(area.id);
        }

        // 构建完整的层级结构
        self.build_hierarchy(&mut areas, &tree);

        // 更新缓存
        {
            let mut areas_guard = self.areas.write().unwrap();
            *areas_guard = areas;
        }
        {
            let mut tree_guard = self.tree.write().unwrap();
            *tree_guard = tree;
        }
        {
            let mut name_index_guard = self.name_index.write().unwrap();
            *name_index_guard = name_index;
        }

        info!("Area data loading completed, loaded {} areas", self.areas.read().unwrap().len());
        Ok(())
    }

    /// 构建层级结构
    fn build_hierarchy(&self, areas: &mut HashMap<i32, Area>, tree: &HashMap<i32, Vec<i32>>) {
        for (parent_id, child_ids) in tree.iter() {
            // 先只用不可变借用收集 children，结束后再拿可变借用写回
            let children: Vec<Area> = child_ids
                .iter()
                .filter_map(|child_id| areas.get(child_id).cloned())
                .collect();

            if let Some(parent) = areas.get_mut(parent_id) {
                parent.children = children;
            }
        }
    }

    /// 从平铺的 Vec<Area> 构建层级结构
    // pub fn build_hierarchy_from_vec(&self, areas: Vec<Area>) -> Vec<Area> {
    //     use std::collections::{HashMap, HashSet};
    //
    //     // 构造 id -> Area map，并清空 children 确保重新构建
    //     let mut area_map: HashMap<i32, Area> = areas
    //         .into_iter()
    //         .map(|mut a| {
    //             a.children = Vec::new();
    //             (a.id, a)
    //         })
    //         .collect();
    //
    //     // 构建 parent_id -> Vec<child_id>
    //     let mut child_map: HashMap<i32, Vec<i32>> = HashMap::new();
    //     for area in area_map.values() {
    //         child_map.entry(area.parent_id).or_default().push(area.id);
    //     }
    //
    //     // 所有 id 集合（用于判定 parent 是否存在）
    //     let ids: HashSet<i32> = area_map.keys().copied().collect();
    //
    //     // 根：parent_id 不在 ids 的节点
    //     let mut root_ids: Vec<i32> = area_map
    //         .values()
    //         .filter(|a| !ids.contains(&a.parent_id))
    //         .map(|a| a.id)
    //         .collect();
    //
    //     // 为了稳定输出，按 id 排序
    //     root_ids.sort_unstable();
    //
    //     // DFS 构建子树，同时做路径级别的环检测（visited 用于当前递归栈）
    //     let mut visited: HashSet<i32> = HashSet::new();
    //
    //     fn attach_children(
    //         id: i32,
    //         area_map: &mut HashMap<i32, Area>,
    //         child_map: &HashMap<i32, Vec<i32>>,
    //         visited: &mut HashSet<i32>,
    //     ) -> Option<Area> {
    //         if visited.contains(&id) {
    //             // 检测到环，停止继续下钻以避免死循环
    //             return None;
    //         }
    //
    //         // 取走节点以取得所有权（已清空 children）
    //         let mut node = match area_map.remove(&id) {
    //             Some(n) => n,
    //             None => return None, // 节点已被其它分支处理或不存在
    //         };
    //
    //         visited.insert(id);
    //
    //         if let Some(child_ids) = child_map.get(&id) {
    //             // 保持孩子 id 的原始顺序
    //             let mut children_vec = Vec::with_capacity(child_ids.len());
    //             for &cid in child_ids {
    //                 if let Some(child) = attach_children(cid, area_map, child_map, visited) {
    //                     children_vec.push(child);
    //                 }
    //                 // 如果 child 为 None（缺失或检测到环），就跳过
    //             }
    //             node.children = children_vec;
    //         }
    //
    //         visited.remove(&id);
    //         Some(node)
    //     }
    //
    //     // 构建根列表
    //     let mut roots = Vec::with_capacity(root_ids.len());
    //     for rid in root_ids {
    //         if let Some(root) = attach_children(rid, &mut area_map, &child_map, &mut visited) {
    //             roots.push(root);
    //         }
    //     }
    //
    //     // 如果还有剩余未处理的节点（其祖先都缺失或被环阻断），把它们也构建出来作为独立根
    //     if !area_map.is_empty() {
    //         let mut remaining_ids: Vec<i32> = area_map.keys().copied().collect();
    //         remaining_ids.sort_unstable();
    //         for id in remaining_ids {
    //             if let Some(node) = attach_children(id, &mut area_map, &child_map, &mut visited) {
    //                 roots.push(node);
    //             }
    //         }
    //     }
    //
    //     roots
    // }

    pub fn build_hierarchy_from_vec(&self, mut areas: Vec<Area>) -> Vec<Area> {
        use std::collections::{HashMap, HashSet};

        // 构造 id -> Area map，并清空 children
        let mut area_map: HashMap<i32, Area> = areas
            .drain(..)
            .map(|mut a| {
                a.children = Vec::new();
                (a.id, a)
            })
            .collect();

        // 构建 parent_id -> Vec<child_id> 映射
        let mut child_map: HashMap<i32, Vec<i32>> = HashMap::new();
        for area in area_map.values() {
            child_map.entry(area.parent_id).or_default().push(area.id);
        }

        let ids: HashSet<i32> = area_map.keys().copied().collect();

        // 根节点判定：parent_id 不在 ids 集合中
        let mut root_ids: Vec<i32> = area_map
            .values()
            .filter(|a| !ids.contains(&a.parent_id))
            .map(|a| a.id)
            .collect();

        // 回退策略：如果没有根节点，尝试 parent_id == 0
        // if root_ids.is_empty() {
        //     root_ids = area_map
        //         .values()
        //         .filter(|a| a.parent_id == 0)
        //         .map(|a| a.id)
        //         .collect();
        // }
        //
        // // 再回退：仍然没有根，使用所有 id
        // if root_ids.is_empty() {
        //     root_ids = ids.iter().copied().collect();
        // }

        // 根节点排序
        root_ids.sort_unstable();

        let mut visited: HashSet<i32> = HashSet::new();

        // 递归构建子树并排序
        fn attach_children(
            id: i32,
            area_map: &mut HashMap<i32, Area>,
            child_map: &HashMap<i32, Vec<i32>>,
            visited: &mut HashSet<i32>,
        ) -> Option<Area> {
            if visited.contains(&id) {
                return None; // 检测到环
            }

            let mut node = area_map.remove(&id)?;
            visited.insert(id);

            if let Some(child_ids) = child_map.get(&id) {
                let mut children: Vec<Area> = child_ids
                    .iter()
                    .filter_map(|&cid| attach_children(cid, area_map, child_map, visited))
                    .collect();

                // 按 id 排序
                children.sort_unstable_by_key(|a| a.id);
                node.children = children;
            }

            visited.remove(&id);
            Some(node)
        }

        let mut roots = Vec::with_capacity(root_ids.len());
        for rid in root_ids {
            if let Some(root) = attach_children(rid, &mut area_map, &child_map, &mut visited) {
                roots.push(root);
            }
        }

        // 剩余节点也构建出来并排序
        if !area_map.is_empty() {
            let mut remaining_ids: Vec<i32> = area_map.keys().copied().collect();
            remaining_ids.sort_unstable();
            for id in remaining_ids {
                if let Some(node) = attach_children(id, &mut area_map, &child_map, &mut visited) {
                    roots.push(node);
                }
            }
        }

        roots
    }

    /// 根据ID获取区域信息
    pub fn get_by_id(&self, id: i32) -> Option<Area> {
        self.areas.read().unwrap().get(&id).cloned()
    }

    /// 根据名称获取区域信息
    pub fn get_by_name(&self, name: &str) -> Vec<Area> {
        let name_index = self.name_index.read().unwrap();
        if let Some(ids) = name_index.get(name) {
            let areas = self.areas.read().unwrap();
            ids.iter()
                .filter_map(|&id| areas.get(&id).cloned())
                .collect()
        } else {
            Vec::new()
        }
    }

    /// 模糊搜索区域名称
    pub fn search_by_name(&self, keyword: &str) -> Vec<Area> {
        let areas = self.areas.read().unwrap();
        let mut results = Vec::new();
        
        for area in areas.values() {
            if area.name.contains(keyword) {
                results.push(area.clone());
            }
        }
        
        results
    }

    /// 获取指定父级下的所有子区域
    pub fn get_children(&self, parent_id: i32) -> Vec<Area> {
        let tree = self.tree.read().unwrap();
        let areas = self.areas.read().unwrap();
        
        if let Some(child_ids) = tree.get(&parent_id) {
            child_ids.iter()
                .filter_map(|&id| areas.get(&id).cloned())
                .collect()
        } else {
            Vec::new()
        }
    }

    /// 获取指定区域的所有父级区域（从根到当前）
    pub fn get_parents(&self, area_id: i32) -> Vec<Area> {
        let areas = self.areas.read().unwrap();
        let mut parents = Vec::new();
        let mut current_id = area_id;
        
        while let Some(area) = areas.get(&current_id) {
            if area.parent_id == 0 {
                break;
            }
            if let Some(parent) = areas.get(&area.parent_id) {
                parents.insert(0, parent.clone());
                current_id = area.parent_id;
            } else {
                break;
            }
        }
        
        parents
    }

    /// 获取指定区域的所有子区域（递归）
    pub fn get_all_children(&self, area_id: i32) -> Vec<Area> {
        let mut all_children = Vec::new();
        self.collect_children_recursive(area_id, &mut all_children);
        all_children
    }

    /// 递归收集所有子区域
    fn collect_children_recursive(&self, area_id: i32, children: &mut Vec<Area>) {
        let tree = self.tree.read().unwrap();
        let areas = self.areas.read().unwrap();
        self.collect_recursive_inner(area_id, children, &tree, &areas);
    }

    fn collect_recursive_inner(
        &self,
        area_id: i32,
        children: &mut Vec<Area>,
        tree: &HashMap<i32, Vec<i32>>,
        areas: &HashMap<i32, Area>,
    ) {
        if let Some(child_ids) = tree.get(&area_id) {
            for &child_id in child_ids {
                if let Some(child) = areas.get(&child_id) {
                    children.push(child.clone());
                    self.collect_recursive_inner(child_id, children, tree, areas);
                }
            }
        }
    }

    /// 获取区域路径（从根到当前区域的名称组合）
    pub fn get_area_path(&self, area_id: i32) -> String {
        let parents = self.get_parents(area_id);
        let current = self.get_by_id(area_id);
        
        let mut path_parts = Vec::new();
        
        // 添加父级区域
        for parent in parents {
            path_parts.push(parent.name);
        }
        
        // 添加当前区域
        if let Some(area) = current {
            path_parts.push(area.name);
        }
        
        path_parts.join(" / ")
    }

    /// 获取所有顶级区域（国家/地区）
    pub fn get_countries(&self) -> Vec<Area> {
        self.get_children(0)
    }

    /// 获取指定国家的所有省份
    pub fn get_provinces(&self, country_id: i32) -> Vec<Area> {
        self.get_children(country_id)
    }

    /// 获取指定省份的所有城市
    pub fn get_cities(&self, province_id: i32) -> Vec<Area> {
        self.get_children(province_id)
    }

    /// 获取缓存统计信息
    pub fn get_cache_stats(&self) -> CacheStats {
        let areas = self.areas.read().unwrap();
        let tree = self.tree.read().unwrap();
        let name_index = self.name_index.read().unwrap();
        
        CacheStats {
            total_areas: areas.len(),
            total_countries: tree.get(&0).map(|v| v.len()).unwrap_or(0),
            name_index_size: name_index.len(),
        }
    }

    /// 清空缓存
    pub fn clear(&self) {
        {
            let mut areas = self.areas.write().unwrap();
            areas.clear();
        }
        {
            let mut tree = self.tree.write().unwrap();
            tree.clear();
        }
        {
            let mut name_index = self.name_index.write().unwrap();
            name_index.clear();
        }
        info!("Area cache cleared");
    }
}

/// CSV记录结构
#[derive(Debug, Deserialize)]
pub struct CsvRecord {
    pub id: i32,
    pub name: String,
    #[serde(rename = "type")]
    pub area_type: i32,
    pub parent_id: i32,
}

/// 缓存统计信息
#[derive(Debug, Serialize, utoipa::ToSchema)]
pub struct CacheStats {
    pub total_areas: usize,
    pub total_countries: usize,
    pub name_index_size: usize,
}

impl Default for AreaCache {
    fn default() -> Self {
        Self::new()
    }
}

/// 全局区域缓存实例
lazy_static::lazy_static! {
    pub static ref AREA_CACHE: AreaCache = AreaCache::new();
}

/// 初始化区域缓存
pub async fn init_area_cache() -> Result<()> {
    let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    path.push("resources");
    path.push("area.csv");
    info!("path: {:?}", path);
    AREA_CACHE.load_from_csv(path.to_str().unwrap())?;
    Ok(())
}

/// 获取区域缓存的便捷函数
pub fn get_area_cache() -> &'static AreaCache {
    &AREA_CACHE
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_area_type_conversion() {
        assert_eq!(AreaType::from(1), AreaType::Country);
        assert_eq!(AreaType::from(2), AreaType::Province);
        assert_eq!(AreaType::from(3), AreaType::City);
        assert_eq!(AreaType::from(4), AreaType::District);
        assert_eq!(AreaType::from(5), AreaType::Street);
        assert_eq!(AreaType::from(99), AreaType::Country); // 默认值
    }

    #[test]
    fn test_area_cache_creation() {
        let cache = AreaCache::new();
        let stats = cache.get_cache_stats();
        assert_eq!(stats.total_areas, 0);
        assert_eq!(stats.total_countries, 0);
    }
}
