import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = useAuthStore.getState();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
      return data.data; // 返回 data.data
    } else {
      const message = data.message || 'Request failed';
      return Promise.reject(new Error(message));
    }
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
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