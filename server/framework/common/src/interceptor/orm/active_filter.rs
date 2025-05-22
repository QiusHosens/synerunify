use crate::context::context::LoginUserContext;
use sea_orm::entity::prelude::*;
use sea_orm::sea_query::IntoValueTuple;
use sea_orm::strum::IntoEnumIterator;
use sea_orm::{
    ColumnTrait, Condition, EntityTrait, IdenStatic, Iterable, PrimaryKeyToColumn, PrimaryKeyTrait,
    QueryFilter, Select,
};

const DATA_PERMISSION_DEFAULT_FIELD_DEPARTMENT_ID: &str = "department_id";
const DATA_PERMISSION_DEFAULT_FIELD_DEPARTMENT_CODE: &str = "department_code";

pub trait ActiveFilterEntityTrait: EntityTrait
where
    Self::Column: IntoEnumIterator + IdenStatic,
{
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
        Self::find().filter(Self::active_condition())
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

    fn find_active_with_data_permission(login_user: LoginUserContext) -> Select<Self>
    where
        Self: Sized,
    {
        let mut query = Self::find().filter(Self::active_condition());

        let data_permission = login_user.data_permission;
        if data_permission.is_none() {
            return query;
        }
        let data_permission = data_permission.unwrap(); // 安全解包，因为已检查非 None

        let mut column = None;
        if data_permission.field.is_none() {
            // 数据权限2/3/5涉及部门权限,需要表格中包含部门id/部门code字段
            if data_permission.id == 2 || data_permission.id == 3 || data_permission.id == 5 {
                // 查找 department_id 列
                let column_department_id = Self::Column::iter().find(|col| {
                    col.to_string()
                        .eq_ignore_ascii_case(DATA_PERMISSION_DEFAULT_FIELD_DEPARTMENT_ID)
                });

                // 查找 department_code 列
                let column_department_code = Self::Column::iter().find(|col| {
                    col.to_string()
                        .eq_ignore_ascii_case(DATA_PERMISSION_DEFAULT_FIELD_DEPARTMENT_CODE)
                });

                // 如果没有 department_id 列，返回空结果
                if column_department_id.is_none() || column_department_code.is_none() {
                    return query
                        .filter(Condition::all().add(sea_orm::sea_query::Expr::val(1).eq(0)));
                }
                column = column.unwrap();
            }
        } else {
            
        }

        // 根据权限类型应用不同的过滤条件
        match data_permission.id {
            // 全部数据权限 - 不添加额外过滤
            1 => (),
            // 本部门数据权限
            2 => {
                query = query.filter(column.eq(login_user.department_id));
            }
            // 本部门及以下数据权限
            3 => {
                query = query.filter(
                    Condition::any()
                        .add(column.eq(data_permission.department_id))
                        .add(column.in_subquery(
                            // 假设有一个获取子部门的查询
                            Self::find_sub_departments(data_permission.department_id),
                        )),
                );
            }
            // 仅本人数据权限
            4 => {
                query = query.filter(Self::Column::UserId.eq(login_user.user_id));
            }
            // 指定部门数据权限
            5 => {
                if let Some(specified_dept_ids) = data_permission.specified_department_ids {
                    query = query.filter(column.in_(specified_dept_ids));
                }
            }
            _ => {
                // 处理未知权限类型，返回空结果
                query = query.filter(Condition::all().add(sea_orm::sea_query::Expr::val(1).eq(0)));
            }
        }

        query
    }
}
