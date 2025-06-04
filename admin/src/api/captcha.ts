import { api } from '@/utils/request';

const apis = {
  getData: '/captcha/public/get-data', // 获取验证码数据
  checkData: '/captcha/public/check-data', // 校验验证码数据
  checkStatus: '/captcha/public/check-status', // 获取校验结果
}

export const getData = (): Promise<any> => {
  return api.get<any>(apis.getData);
};