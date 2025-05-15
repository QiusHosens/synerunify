use std::collections::HashSet;

use sea_orm::prelude::Expr;
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, TransactionTrait};
use crate::model::system_role_menu::{Model as SystemRoleMenuModel, ActiveModel as SystemRoleMenuActiveModel, Entity as SystemRoleMenuEntity, Column};
use system_model::request::system_role_menu::{UpdateSystemRoleMenuRequest};
use system_model::response::system_role_menu::SystemRoleMenuResponse;
use crate::convert::system_role_menu::{model_to_response};
use anyhow::{Result, anyhow};
use sea_orm::ActiveValue::Set;
use tracing::info;
use common::base::page::PaginatedResponse;
use common::context::context::LoginUserContext;
use common::interceptor::orm::active_filter::ActiveFilterEntityTrait;
use crate::service;

pub async fn update(
    db: &DatabaseConnection,
    login_user: LoginUserContext,
    request: UpdateSystemRoleMenuRequest,
) -> Result<()> {
    // Query existing role-menu relationships
    let existing_menus = SystemRoleMenuEntity::find()
        .filter(Column::RoleId.eq(request.role_id))
        .all(db)
        .await?;

    // Convert existing menus to HashSet for efficient lookup
    let existing_menu_ids: HashSet<i64> = existing_menus.iter().map(|m| m.menu_id).collect();
    let request_menu_ids: HashSet<i64> = request.menu_id_list.into_iter().collect();

    // Find menus to add (in request but not in database)
    let to_add: Vec<i64> = request_menu_ids
        .difference(&existing_menu_ids)
        .copied()
        .collect();

    // Find menus to mark as deleted (in database but not in request)
    let to_mark_deleted: Vec<i64> = existing_menu_ids
        .difference(&request_menu_ids)
        .copied()
        .collect();

    // Find menus to restore/update (in both database and request)
    let to_update: Vec<i64> = request_menu_ids
        .intersection(&existing_menu_ids)
        .copied()
        .collect();

    // Start a transaction
    db.transaction::<_, _, sea_orm::DbErr>(|txn| {
        Box::pin(async move {
            // Batch insert new role-menu relationships (deleted = 0 for active)
            if !to_add.is_empty() {
                let new_role_menus: Vec<_> = to_add.into_iter().map(|menu_id| {
                    SystemRoleMenuActiveModel {
                        role_id: Set(request.role_id),
                        menu_id: Set(menu_id),
                        creator: Set(Some(login_user.id)),
                        updater: Set(Some(login_user.id)),
                        tenant_id: Set(login_user.tenant_id),
                        ..Default::default()
                    }
                }).collect();
                
                SystemRoleMenuEntity::insert_many(new_role_menus).exec(txn).await?;
            }

            // Batch mark removed role-menu relationships as deleted (set deleted = 1)
            if !to_mark_deleted.is_empty() {
                SystemRoleMenuEntity::update_many()
                    .col_expr(Column::Deleted, Expr::value(1)) // Mark as deleted
                    .col_expr(Column::Updater, Expr::value(Some(login_user.id)))
                    .filter(Column::RoleId.eq(request.role_id))
                    .filter(Column::MenuId.is_in(to_mark_deleted))
                    .exec(txn)
                    .await?;
            }

            // Batch restore/update existing relationships (set deleted = 0 for active)
            if !to_update.is_empty() {
                SystemRoleMenuEntity::update_many()
                    .col_expr(Column::Deleted, Expr::value(0)) // Ensure active
                    .col_expr(Column::Updater, Expr::value(Some(login_user.id)))
                    .filter(Column::RoleId.eq(request.role_id))
                    .filter(Column::MenuId.is_in(to_update))
                    .exec(txn)
                    .await?;
            }

            // TODO 移除相关角色用户token,使用户重新登录

            Ok(())
        })
    }).await?;

    Ok(())
}

pub async fn list(db: &DatabaseConnection, login_user: LoginUserContext) -> Result<Vec<SystemRoleMenuResponse>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let list = SystemRoleMenuEntity::find_active_with_condition(condition)
        .all(db).await?;
    Ok(list.into_iter().map(model_to_response).collect())
}

pub async fn get_role_menu(db: &DatabaseConnection, login_user: LoginUserContext, role_id: i64) -> Result<Vec<i64>> {
    let condition = Condition::all().add(Column::TenantId.eq(login_user.tenant_id));
    let list = SystemRoleMenuEntity::find_active_with_condition(condition)
        .filter(Column::RoleId.eq(role_id))
        .all(db).await?;
    Ok(list.into_iter().map(|m| m.menu_id).collect())
}

pub async fn get_role_menu_ids(db: &DatabaseConnection, role_id: i64) -> Result<Vec<i64>> {
    let list = SystemRoleMenuEntity::find_active()
        .filter(Column::RoleId.eq(role_id))
        .all(db).await?;
    Ok(list.into_iter().map(|m| m.menu_id).collect())
}