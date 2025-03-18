import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/api/login',
    method: 'post',
    response: () => ({
      code: 200,
      message: 'Login successful',
      data: { token: 'mock-token' },
    }),
  },
] as MockMethod[];