use sea_orm::{Condition, DatabaseConnection, EntityTrait, QueryFilter, Select};

pub trait ActiveFilterEntityTrait: EntityTrait {
    fn active_condition() -> Condition
    where
        Self: Sized,
    {
        // 默认实现（可以被覆盖）
        Condition::all()
    }

    // 通用的查询未删除记录的方法
    fn find_active(_db: &DatabaseConnection) -> Select<Self>
    where
        Self: Sized,
    {
        Self::find()
            .filter(Self::active_condition())
    }

    // 支持额外条件的查询
    fn find_active_with_condition(_db: &DatabaseConnection, extra_condition: Condition) -> Select<Self>
    where
        Self: Sized,
    {
        Self::find()
            .filter(Self::active_condition())
            .filter(extra_condition)
    }
}