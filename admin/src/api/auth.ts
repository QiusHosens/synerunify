import { api } from '@/utils/request';

const apis = {
  login: '/system_auth/login', // 登录
  refreshToken: '/system_auth/refresh_token', // 刷新token
  home: '/system_auth/home', // 主页信息
}

// 定义请求和响应的类型
interface LoginRequest {
  username: string;
  password: string;
}

interface TokenResponse {
  token_type: string; // token类型
  access_token: string;
  refresh_token: string;
  exp: number; // 过期时间
  iat: number; // 签发时间
}

// API
export const login = (data: LoginRequest): Promise<TokenResponse> => {
  return api.post<TokenResponse>(apis.login, data);
};

export const refreshToken = (data: String): Promise<TokenResponse> => {
  return api.post<TokenResponse>(apis.refreshToken, data);
};

interface HomeMenuResponse {
  name: string; // 菜单名称
  type: number; // 菜单类型
  sort: number; // 显示顺序
  parent_id: number; // 父菜单ID
  path: string; // 路由地址
  icon: string; // 菜单图标
  component: string; // 组件路径
  component_name: string; // 组件名
  status: number; // 菜单状态
  visible: boolean; // 是否可见
  keep_alive: boolean; // 是否缓存
  always_show: boolean; // 是否总是显示
}

interface HomeResponse {
  nickname: string;
  menus: Array<HomeMenuResponse>;
}

export const getHome = (): Promise<HomeResponse> => {
  return api.get<HomeResponse>(apis.home);
};