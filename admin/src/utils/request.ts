import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import { messageEventBus } from '@/components/GlobalMessage';
import { AlertColor } from '@mui/material';

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

const showMessage = (message: string, severity: AlertColor) => {
  messageEventBus.publish(message, severity, 3000);
}

const logout = (message: string) => {
  // 通过事件总线触发错误消息
  showMessage(message, 'error');
  setTimeout(() => {
    useAuthStore.getState().logout();
    // window.location.href = '/login';
  }, 3000)
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
    // console.log('refresh token error', error);
    logout('刷新授权失败');
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
      // showMessage('成功', 'success');
      return data.data;
    } else {
      const message = data.message || 'Request failed';
      showMessage(message, 'error');
      return Promise.reject(new Error(message));
    }
  },
  async (error) => {
    // debugger
    // console.log('request error', error);
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status } = error.response;
    const originalRequest = error.config;

    switch (status) {
      case 401:
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
          logout('授权失败');
        }
        break;
      case 403:
        // 403直接退出登录
        logout('登录已失效,请重新登录');
        break;
      case 422:
        showMessage('参数有误', 'error');
        break;
      default:
        showMessage('请求异常', 'error');
        break;
    }

    return Promise.reject(error);
  }
);

// 类型化的请求方法
export const api = {
  get: <T>(url: string, param?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
    const requestConfig = {
      ...(config || {}),
      params: param !== undefined ? param : config?.params,
    } as InternalAxiosRequestConfig;
    return request.get(url, requestConfig);
  },

  post: <T>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> =>
    request.post(url, data, config),
};

export default request;