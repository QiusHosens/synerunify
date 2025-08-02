use sea_orm::{Set, NotSet};
use crate::model::mall_product_spu::{self, Model as MallProductSpu, ActiveModel as MallProductSpuActiveModel};
use mall_model::request::mall_product_spu::{CreateMallProductSpuRequest, UpdateMallProductSpuRequest};
use mall_model::response::mall_product_spu::MallProductSpuResponse;

pub fn create_request_to_model(request: &CreateMallProductSpuRequest) -> MallProductSpuActiveModel {
    MallProductSpuActiveModel {
        name: Set(request.name.clone()),
        keyword: request.keyword.as_ref().map_or(NotSet, |keyword| Set(Some(keyword.clone()))),
        introduction: request.introduction.as_ref().map_or(NotSet, |introduction| Set(Some(introduction.clone()))),
        description: request.description.as_ref().map_or(NotSet, |description| Set(Some(description.clone()))),
        category_id: Set(request.category_id.clone()),
        brand_id: request.brand_id.as_ref().map_or(NotSet, |brand_id| Set(Some(brand_id.clone()))),
        pic_url: Set(request.pic_url.clone()),
        slider_pic_urls: request.slider_pic_urls.as_ref().map_or(NotSet, |slider_pic_urls| Set(Some(slider_pic_urls.clone()))),
        sort: Set(request.sort.clone()),
        status: Set(request.status.clone()),
        spec_type: request.spec_type.as_ref().map_or(NotSet, |spec_type| Set(Some(spec_type.clone()))),
        price: Set(request.price.clone()),
        market_price: request.market_price.as_ref().map_or(NotSet, |market_price| Set(Some(market_price.clone()))),
        cost_price: Set(request.cost_price.clone()),
        stock: Set(request.stock.clone()),
        delivery_types: Set(request.delivery_types.clone()),
        delivery_template_id: request.delivery_template_id.as_ref().map_or(NotSet, |delivery_template_id| Set(Some(delivery_template_id.clone()))),
        give_integral: Set(request.give_integral.clone()),
        sub_commission_type: request.sub_commission_type.as_ref().map_or(NotSet, |sub_commission_type| Set(Some(sub_commission_type.clone()))),
        sales_count: request.sales_count.as_ref().map_or(NotSet, |sales_count| Set(Some(sales_count.clone()))),
        virtual_sales_count: request.virtual_sales_count.as_ref().map_or(NotSet, |virtual_sales_count| Set(Some(virtual_sales_count.clone()))),
        browse_count: request.browse_count.as_ref().map_or(NotSet, |browse_count| Set(Some(browse_count.clone()))),
        ..Default::default()
    }
}

pub fn update_request_to_model(request: &UpdateMallProductSpuRequest, existing: MallProductSpu) -> MallProductSpuActiveModel {
    let mut active_model: MallProductSpuActiveModel = existing.into();
    if let Some(name) = &request.name { 
        active_model.name = Set(name.clone());
    }
    if let Some(keyword) = &request.keyword { 
        active_model.keyword = Set(Some(keyword.clone()));
    }
    if let Some(introduction) = &request.introduction { 
        active_model.introduction = Set(Some(introduction.clone()));
    }
    if let Some(description) = &request.description { 
        active_model.description = Set(Some(description.clone()));
    }
    if let Some(category_id) = &request.category_id { 
        active_model.category_id = Set(category_id.clone());
    }
    if let Some(brand_id) = &request.brand_id { 
        active_model.brand_id = Set(Some(brand_id.clone()));
    }
    if let Some(pic_url) = &request.pic_url { 
        active_model.pic_url = Set(pic_url.clone());
    }
    if let Some(slider_pic_urls) = &request.slider_pic_urls { 
        active_model.slider_pic_urls = Set(Some(slider_pic_urls.clone()));
    }
    if let Some(sort) = &request.sort { 
        active_model.sort = Set(sort.clone());
    }
    if let Some(status) = &request.status { 
        active_model.status = Set(status.clone());
    }
    if let Some(spec_type) = &request.spec_type { 
        active_model.spec_type = Set(Some(spec_type.clone()));
    }
    if let Some(price) = &request.price { 
        active_model.price = Set(price.clone());
    }
    if let Some(market_price) = &request.market_price { 
        active_model.market_price = Set(Some(market_price.clone()));
    }
    if let Some(cost_price) = &request.cost_price { 
        active_model.cost_price = Set(cost_price.clone());
    }
    if let Some(stock) = &request.stock { 
        active_model.stock = Set(stock.clone());
    }
    if let Some(delivery_types) = &request.delivery_types { 
        active_model.delivery_types = Set(delivery_types.clone());
    }
    if let Some(delivery_template_id) = &request.delivery_template_id { 
        active_model.delivery_template_id = Set(Some(delivery_template_id.clone()));
    }
    if let Some(give_integral) = &request.give_integral { 
        active_model.give_integral = Set(give_integral.clone());
    }
    if let Some(sub_commission_type) = &request.sub_commission_type { 
        active_model.sub_commission_type = Set(Some(sub_commission_type.clone()));
    }
    if let Some(sales_count) = &request.sales_count { 
        active_model.sales_count = Set(Some(sales_count.clone()));
    }
    if let Some(virtual_sales_count) = &request.virtual_sales_count { 
        active_model.virtual_sales_count = Set(Some(virtual_sales_count.clone()));
    }
    if let Some(browse_count) = &request.browse_count { 
        active_model.browse_count = Set(Some(browse_count.clone()));
    }
    active_model
}

pub fn model_to_response(model: MallProductSpu) -> MallProductSpuResponse {
    MallProductSpuResponse { 
        id: model.id,
        name: model.name,
        keyword: model.keyword,
        introduction: model.introduction,
        description: model.description,
        category_id: model.category_id,
        brand_id: model.brand_id,
        pic_url: model.pic_url,
        slider_pic_urls: model.slider_pic_urls,
        sort: model.sort,
        status: model.status,
        spec_type: model.spec_type,
        price: model.price,
        market_price: model.market_price,
        cost_price: model.cost_price,
        stock: model.stock,
        delivery_types: model.delivery_types,
        delivery_template_id: model.delivery_template_id,
        give_integral: model.give_integral,
        sub_commission_type: model.sub_commission_type,
        sales_count: model.sales_count,
        virtual_sales_count: model.virtual_sales_count,
        browse_count: model.browse_count,
        creator: model.creator,
        create_time: model.create_time,
        updater: model.updater,
        update_time: model.update_time,
    }
}