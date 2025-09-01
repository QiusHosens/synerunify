use system_model::response::system_area::AreaResponse;
use crate::utils::area_utils::Area;

pub fn model_to_response(area: Area) -> AreaResponse {
    AreaResponse {
        id: area.id,
        name: area.name,
        area_type: area.area_type as i32,
        parent_id: area.parent_id,
        children: if area.children.is_empty() {
            None
        } else {
            Some(area.children.into_iter().map(model_to_response).collect())
        },
    }
}