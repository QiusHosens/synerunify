import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';

const baseURL = '/api';

const apis = {
  refreshToken: baseURL + '/system_auth/refresh_token', // 刷新token
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
});

// 正在刷新 token 的标志
let isRefreshing = false;
// 存储等待中的请求
let refreshSubscribers: ((token: string) => void)[] = [];

const logout = () => {
  useAuthStore.getState().logout();
  window.location.href = '/login';
}

// 刷新 token 的函数
const refreshToken = async () => {
  try {
    const { refresh_token } = useAuthStore.getState();
    const response = await axios.post(apis.refreshToken, {
      refresh_token
    });

    const { token_type, access_token, refresh_token: newRefreshToken } = response.data.data;
    // console.log('refresh token', token_type, access_token, newRefreshToken, response.data);
    useAuthStore.getState().login(token_type, access_token, newRefreshToken);

    return `${token_type} ${access_token}`;
  } catch (error) {
    console.log('refresh token error', error);
    logout();
    throw error;
  }
};

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token_type, access_token } = useAuthStore.getState();
    if (token_type && access_token && config.headers) {
      config.headers['Authorization'] = `${token_type} ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    if (data.code === 200) {
      return data.data;
    } else {
      const message = data.message || 'Request failed';
      return Promise.reject(new Error(message));
    }
  },
  async (error) => {
    // debugger
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;
    const originalRequest = error.config;

    if (status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshToken();
            // 通知所有等待中的请求
            refreshSubscribers.forEach(callback => callback(newToken));
            refreshSubscribers = [];
            // 重试原始请求
            originalRequest.headers['Authorization'] = newToken;
            return request(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // 如果已经在刷新 token，则将请求加入等待队列
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers['Authorization'] = token;
            resolve(request(originalRequest));
          });
        });
      } else {
        // 如果是刷新 token 失败后的重试，则直接登出
        logout();
      }
    } else if (status === 403) {
      // 403直接退出登录
      logout();
    }
    return Promise.reject(error);
  }
);

// 类型化的请求方法
export const api = {
  get: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> =>
    request.get(url, config),
  post: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> =>
    request.post(url, data, config),
};

export default request;