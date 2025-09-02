use crate::convert::system_area::model_to_response;
use crate::utils::area_utils::get_area_cache;
use anyhow::{anyhow, Result};
use system_model::response::system_area::{AreaPathResponse, AreaResponse};

pub fn get_tree() -> Result<Vec<AreaResponse>> {
    let cache = get_area_cache();
    let areas = cache.get_all_children(1);
    let areas = cache.build_hierarchy_from_vec(areas);
    let areas = areas.into_iter().map(model_to_response).collect();
    Ok(areas)
}

pub fn get_by_id(id: i32) -> Result<Option<AreaResponse>> {
    let cache = get_area_cache();
    if let Some(area) = cache.get_by_id(id) {
        // 拿到当前节点及其所有子节点
        let mut nodes = cache.get_all_children(id);
        nodes.insert(0, area);

        let hierarchy = cache.build_hierarchy_from_vec(nodes);

        // 找到第一个根节点（可能就是当前 id 对应的区域）
        let root = hierarchy
            .into_iter()
            .find(|a| a.id == id)
            .ok_or_else(|| anyhow!("failed to build hierarchy for area {}", id))?;

        Ok(Some(model_to_response(root)))
    } else {
        Ok(None)
    }
}

pub fn get_path(id: i32) -> Result<Option<AreaPathResponse>> {
    let cache = get_area_cache();
    if let Some(area) = cache.get_by_id(id) {
        let path = cache.get_area_path(id);
        let response = AreaPathResponse {
            id: area.id,
            name: area.name,
            path,
        };
        Ok(Some(response))
    } else {
        Ok(None)
    }
}