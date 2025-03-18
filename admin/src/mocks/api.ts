import { MockMethod } from 'vite-plugin-mock';

// 定义请求体的类型
interface LoginRequestBody {
  username: string;
  password: string;
}

// 定义请求头的类型
interface RequestHeaders {
  [key: string]: string; // 键值对，值通常是字符串
}

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }: { body: LoginRequestBody }) => ({
      code: 200,
      message: 'Login successful',
      data: {
        token: 'mock-token-' + body.username,
      },
    }),
  },
  {
    url: '/api/dashboard',
    method: 'get',
    response: ({ headers }: { headers: RequestHeaders }) => {
      // console.log('Request headers:', headers); // 验证 token 是否携带
      return {
        code: 200,
        message: 'Success',
        data: { info: 'Dashboard data' },
      };
    },
  },
] as MockMethod[];