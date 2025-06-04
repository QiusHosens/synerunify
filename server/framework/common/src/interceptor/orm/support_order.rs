use sea_orm::strum::IntoEnumIterator;
use sea_orm::{
    entity::*, query::*, IdenStatic, Iden, IntoSimpleExpr, Order,
    QueryOrder,
};

// 定义 SupportOrder trait
pub trait SupportOrder: Sized {
    fn support_order<C: IntoSimpleExpr>(
        self,
        sort_field: Option<String>,
        sort: Option<String>,
        default_sort: Option<Vec<(C, Order)>>,
    ) -> Self;
}

// 为 Select<T> 实现
impl<T> SupportOrder for Select<T>
where
    T: EntityTrait,
    T::Column: IntoEnumIterator + IdenStatic,
{
    fn support_order<C: IntoSimpleExpr>(
        self,
        sort_field: Option<String>,
        sort: Option<String>,
        default_sort: Option<Vec<(C, Order)>>,
    ) -> Self {
        let mut query = self;
        let mut is_default_sort = true;

        // 优先处理用户提供的 sort_field 和 sort
        if let (Some(field), Some(sort)) = (sort_field, sort) {
            let is_asc = match sort.to_lowercase().as_str() {
                "asc" => true,
                "desc" => false,
                _ => return query, // 忽略无效排序值
            };

            if let Some(column) = T::Column::iter().find(|col| {
                col.to_string().eq_ignore_ascii_case(&field)
            }) {
                is_default_sort = false;
                query = if is_asc {
                    query.order_by_asc(column)
                } else {
                    query.order_by_desc(column)
                };
            }
        }

        // 默认排序
        if is_default_sort {
            if let Some(sort_list) = default_sort {
                for (column, order) in sort_list {
                    query = query.order_by(column, order);
                }
            }
        }

        query
    }
}

// 为 SelectTwo<E1, E2> 实现
impl<E1, E2> SupportOrder for SelectTwo<E1, E2>
where
    E1: EntityTrait,
    E1::Column: IntoEnumIterator + IdenStatic,
    E2: EntityTrait,
    E2::Column: IntoEnumIterator + IdenStatic,
{
    fn support_order<C: IntoSimpleExpr>(
        self,
        sort_field: Option<String>,
        sort: Option<String>,
        default_sort: Option<Vec<(C, Order)>>,
    ) -> Self {
        let mut query = self;
        let mut is_default_sort = true;

        // 优先处理用户提供的 sort_field 和 sort
        if let (Some(field), Some(sort)) = (sort_field, sort) {
            let is_asc = match sort.to_lowercase().as_str() {
                "asc" => true,
                "desc" => false,
                _ => return query, // 忽略无效排序值
            };

            // 尝试 E1 的列
            if let Some(column) = E1::Column::iter().find(|col| {
                col.to_string().eq_ignore_ascii_case(&field)
            }) {
                is_default_sort = false;
                query = if is_asc {
                    query.order_by_asc(column)
                } else {
                    query.order_by_desc(column)
                };
            }
            // 尝试 E2 的列
            else if let Some(column) = E2::Column::iter().find(|col| {
                col.to_string().eq_ignore_ascii_case(&field)
            }) {
                is_default_sort = false;
                query = if is_asc {
                    query.order_by_asc(column)
                } else {
                    query.order_by_desc(column)
                };
            }
        }

        // 默认排序
        if is_default_sort {
            if let Some(sort_list) = default_sort {
                for (column, order) in sort_list {
                    query = query.order_by(column, order);
                }
            }
        }

        query
    }
}

// 为 SelectThree<E1, E2, E3> 实现
impl<E1, E2, E3> SupportOrder for SelectThree<E1, E2, E3>
where
    E1: EntityTrait,
    E1::Column: IntoEnumIterator + IdenStatic,
    E2: EntityTrait,
    E2::Column: IntoEnumIterator + IdenStatic,
    E3: EntityTrait,
    E3::Column: IntoEnumIterator + IdenStatic,
{
    fn support_order<C: IntoSimpleExpr>(
        self,
        sort_field: Option<String>,
        sort: Option<String>,
        default_sort: Option<Vec<(C, Order)>>,
    ) -> Self {
        let mut query = self;
        let mut is_default_sort = true;

        // 优先处理用户提供的 sort_field 和 sort
        if let (Some(field), Some(sort)) = (sort_field, sort) {
            let is_asc = match sort.to_lowercase().as_str() {
                "asc" => true,
                "desc" => false,
                _ => return query, // 忽略无效排序值
            };

            // 尝试 E1 的列
            if let Some(column) = E1::Column::iter().find(|col| {
                col.to_string().eq_ignore_ascii_case(&field)
            }) {
                is_default_sort = false;
                query = if is_asc {
                    query.order_by_asc(column)
                } else {
                    query.order_by_desc(column)
                };
            }
            // 尝试 E2 的列
            else if let Some(column) = E2::Column::iter().find(|col| {
                col.to_string().eq_ignore_ascii_case(&field)
            }) {
                is_default_sort = false;
                query = if is_asc {
                    query.order_by_asc(column)
                } else {
                    query.order_by_desc(column)
                };
            }
            // 尝试 E3 的列
            else if let Some(column) = E3::Column::iter().find(|col| {
                col.to_string().eq_ignore_ascii_case(&field)
            }) {
                is_default_sort = false;
                query = if is_asc {
                    query.order_by_asc(column)
                } else {
                    query.order_by_desc(column)
                };
            }
        }

        // 默认排序
        if is_default_sort {
            if let Some(sort_list) = default_sort {
                for (column, order) in sort_list {
                    query = query.order_by(column, order);
                }
            }
        }

        query
    }
}