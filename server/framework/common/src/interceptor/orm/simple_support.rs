use sea_orm::strum::IntoEnumIterator;
use sea_orm::{
    entity::*, query::*, IdenStatic, Iden, IntoSimpleExpr, Order,
    QueryOrder,
};

// 定义 SimpleSupport trait
pub trait SimpleSupport: Sized {
    // 排序支持
    fn support_order<C: IntoSimpleExpr>(
        self,
        sort_field: Option<String>,
        sort: Option<String>,
        default_sort: Option<Vec<(C, Order)>>,
    ) -> Self;

    // 过滤支持
    fn support_filter(
        self,
        field: Option<String>,
        operator: Option<String>,
        value: Option<String>,
    ) -> Self;
}

// 为 Select<T> 实现
impl<T> SimpleSupport for Select<T>
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

    fn support_filter(
        self,
        field: Option<String>,
        operator: Option<String>,
        value: Option<String>,
    ) -> Self {
        let mut query = self;

        // 如果 field、operator 或 value 为空，则直接返回原查询
        if field.is_none() || operator.is_none() {
            return query;
        }

        let field = field.unwrap();
        let operator = operator.unwrap();
        let value = value.unwrap_or_default();

        // 查找对应的列
        let column = T::Column::iter()
            .find(|col| col.to_string().eq_ignore_ascii_case(&field));
        if (column.is_none()) {
          return query;
        }
        let column = column.unwrap();

        // 根据 operator 构建过滤条件
        let condition = match operator.as_str() {
            "equals" => column.eq(value),
            "contains" => column.like(format!("%{}%", value)),
            "startsWith" => column.like(format!("{}%", value)),
            "endsWith" => column.like(format!("%{}", value)),
            "isEmpty" => column.is_null(),
            "isNotEmpty" => column.is_not_null(),
            "=" => column.eq(value),
            "!=" => column.ne(value),
            ">" => column.gt(&value),
            ">=" => column.gte(value),
            "<" => column.lt(&value),
            "<=" => column.lte(value),
            "isAnyOf" => {
                let values: Vec<String> = value.split(',').map(|s| s.trim().to_string()).collect();
                column.is_in(values)
            }
            _ => return query, // 未知操作符，直接返回原查询
        };

        // 将条件应用到查询
        query.filter(condition)
    }
}

// 为 SelectTwo<E1, E2> 实现
impl<E1, E2> SimpleSupport for SelectTwo<E1, E2>
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

    fn support_filter(
        self,
        field: Option<String>,
        operator: Option<String>,
        value: Option<String>,
    ) -> Self {
        let mut query = self;

        // 如果 field、operator 或 value 为空，则直接返回原查询
        if field.is_none() || operator.is_none() {
            return query;
        }

        let field = field.unwrap();
        let operator = operator.unwrap();
        let value = value.unwrap_or_default();

        // 查找E1对应的列
        let column = E1::Column::iter()
            .find(|col| col.to_string().eq_ignore_ascii_case(&field));
        if (column.is_none()) {
          // 查找E2对应的列
          let column = E2::Column::iter()
            .find(|col| col.to_string().eq_ignore_ascii_case(&field));
        }
        if (column.is_none()) {
          return query;
        }
        let column = column.unwrap();

        // 根据 operator 构建过滤条件
        let condition = match operator.as_str() {
            "equals" => column.eq(value),
            "contains" => column.like(format!("%{}%", value)),
            "startsWith" => column.like(format!("{}%", value)),
            "endsWith" => column.like(format!("%{}", value)),
            "isEmpty" => column.is_null(),
            "isNotEmpty" => column.is_not_null(),
            "=" => column.eq(value),
            "!=" => column.ne(value),
            ">" => column.gt(&value),
            ">=" => column.gte(value),
            "<" => column.lt(&value),
            "<=" => column.lte(value),
            "isAnyOf" => {
                let values: Vec<String> = value.split(',').map(|s| s.trim().to_string()).collect();
                column.is_in(values)
            }
            _ => return query, // 未知操作符，直接返回原查询
        };

        // 将条件应用到查询
        query.filter(condition)
    }
}

// 为 SelectThree<E1, E2, E3> 实现
impl<E1, E2, E3> SimpleSupport for SelectThree<E1, E2, E3>
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

    fn support_filter(
        self,
        field: Option<String>,
        operator: Option<String>,
        value: Option<String>,
    ) -> Self {
        let mut query = self;

        // 如果 field、operator 或 value 为空，则直接返回原查询
        if field.is_none() || operator.is_none() {
            return query;
        }

        let field = field.unwrap();
        let operator = operator.unwrap();
        let value = value.unwrap_or_default();

        // 查找E1对应的列
        let column = E1::Column::iter()
            .find(|col| col.to_string().eq_ignore_ascii_case(&field));
        if (column.is_none()) {
          // 查找E2对应的列
          let column = E2::Column::iter()
            .find(|col| col.to_string().eq_ignore_ascii_case(&field));
        }
        if (column.is_none()) {
          // 查找E3对应的列
          let column = E3::Column::iter()
            .find(|col| col.to_string().eq_ignore_ascii_case(&field));
        }
        if (column.is_none()) {
          return query;
        }
        let column = column.unwrap();

        // 根据 operator 构建过滤条件
        let condition = match operator.as_str() {
            "equals" => column.eq(value),
            "contains" => column.like(format!("%{}%", value)),
            "startsWith" => column.like(format!("{}%", value)),
            "endsWith" => column.like(format!("%{}", value)),
            "isEmpty" => column.is_null(),
            "isNotEmpty" => column.is_not_null(),
            "=" => column.eq(value),
            "!=" => column.ne(value),
            ">" => column.gt(&value),
            ">=" => column.gte(value),
            "<" => column.lt(&value),
            "<=" => column.lte(value),
            "isAnyOf" => {
                let values: Vec<String> = value.split(',').map(|s| s.trim().to_string()).collect();
                column.is_in(values)
            }
            _ => return query, // 未知操作符，直接返回原查询
        };

        // 将条件应用到查询
        query.filter(condition)
    }
}