use common::config::config::Config;
use common::context::context::LoginUserContext;
use common::database::mysql::get_database_instance;
use common::state::app_state::AppState;
use sea_orm::DatabaseConnection;
use tonic::{Request, Response, Status};
use system_grpc::system_client::system::system_service_server::{SystemService, SystemServiceServer};
use system_grpc::system_client::system::{GetUserRequest, GetUserResponse, UserResponse, GetDepartmentRequest, GetDepartmentResponse, DepartmentResponse};

use crate::service::{system_department, system_user};

#[derive(Debug)]
pub struct SystemServiceImpl {
    state: AppState
}

impl SystemServiceImpl {
    pub fn new(state: AppState) -> Self {
        Self { state }
    }
}

#[tonic::async_trait]
impl SystemService for SystemServiceImpl {
    async fn get_user(
        &self,
        request: Request<GetUserRequest>,
    ) -> Result<Response<GetUserResponse>, Status> {
        // let user_context = request
        //     .extensions()
        //     .get::<LoginUserContext>()
        //     .ok_or_else(||None)?;

        let req = request.into_inner();
        // 查询用户
        let database = &self.state.db;
        let users = match system_user::find_by_ids(database, req.id).await {
            Ok(list) => list.into_iter().map(|user| UserResponse {
                id: user.id,
                nickname: user.nickname,
            }).collect(),
            Err(e) => {
                tracing::warn!("Failed to fetch users: {}", e);
                vec![]
            }
        };
        Ok(Response::new(GetUserResponse { list: users }))
    }

    async fn get_department(
        &self,
        request: Request<GetDepartmentRequest>,
    ) -> Result<Response<GetDepartmentResponse>, Status> {
        let req = request.into_inner();
        // 查询部门
        let database = &self.state.db;
        let departments = match system_department::find_by_ids(database, req.id).await {
            Ok(list) => list.into_iter().map(|department| DepartmentResponse {
                id: department.id,
                name: department.name,
            }).collect(),
            Err(e) => {
                tracing::warn!("Failed to fetch departments: {}", e);
                vec![]
            }
        };
        Ok(Response::new(GetDepartmentResponse { list: departments }))
    }
}

pub fn create_system_service(state: AppState) -> SystemServiceServer<SystemServiceImpl> {
    SystemServiceServer::new(SystemServiceImpl::new(state))
}