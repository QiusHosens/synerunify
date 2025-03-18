import { api } from '@/utils/request';

// 定义请求和响应的类型
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

// 登录 API
export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return api.post<LoginResponse>('/login', data);
};

interface DashboardResponse {
  info: string;
}

export const getDashboardData = (): Promise<DashboardResponse> => {
  return api.get<DashboardResponse>('/dashboard');
};