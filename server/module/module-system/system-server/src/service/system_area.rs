use anyhow::Result;
use system_model::response::system_area::AreaResponse;
use crate::convert::system_area::model_to_response;
use crate::utils::area_utils::get_area_cache;

pub fn get_tree() -> Result<Vec<AreaResponse>> {
    let cache = get_area_cache();
    let areas = cache.get_all_children(1);
    Ok(areas.into_iter().map(model_to_response).collect())
}