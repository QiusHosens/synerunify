use sea_orm::{Condition, DatabaseConnection, EntityTrait, Iterable, PrimaryKeyToColumn, PrimaryKeyTrait, QueryFilter, Select, ColumnTrait};
use sea_orm::sea_query::IntoValueTuple;

pub trait ActiveFilterEntityTrait: EntityTrait {
    fn active_condition() -> Condition
    where
        Self: Sized,
    {
        // 默认实现（可以被覆盖）
        Condition::all()
    }

    // 通用的查询未删除记录的方法
    fn find_active() -> Select<Self>
    where
        Self: Sized,
    {
        Self::find()
            .filter(Self::active_condition())
    }

    fn find_active_by_id<T>(values: T) -> Select<Self>
    where
        Self: Sized,
        T: Into<<Self::PrimaryKey as PrimaryKeyTrait>::ValueType>,
    {
        let mut select = Self::find();
        select = select.filter(Self::active_condition());
        let mut keys = Self::PrimaryKey::iter();
        for v in values.into().into_value_tuple() {
            if let Some(key) = keys.next() {
                let col = key.into_column();
                select = select.filter(col.eq(v));
            } else {
                panic!("primary key arity mismatch");
            }
        }
        if keys.next().is_some() {
            panic!("primary key arity mismatch");
        }
        select
    }

    // 支持额外条件的查询
    fn find_active_with_condition(extra_condition: Condition) -> Select<Self>
    where
        Self: Sized,
    {
        Self::find()
            .filter(Self::active_condition())
            .filter(extra_condition)
    }
}