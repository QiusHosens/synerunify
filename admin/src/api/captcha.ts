import { api } from '@/utils/request';

const CAPTCHA_KEY = 'synerunify-secret-key-12345678';

const apis = {
  getData: '/captcha/public/get-data', // 获取验证码数据
  checkData: '/captcha/public/check-data', // 校验验证码数据
  checkStatus: '/captcha/public/check-status', // 获取校验结果
}

export interface CaptchaDataResponse {
  id: string;
  captcha_key: string;
  master_width: number;
  master_height: number;
  thumb_width: number;
  thumb_height: number;
  master_image_base64: string;
  thumb_image_base64: string;

  // 3/4 滑动验证码/拖拽验证码
  display_x: number;
  display_y: number;

  // 5 旋转验证码
  thumb_size: number;
}

export interface CaptchaCheckRequest {
  id: string;
  captchaKey: string;
  value?: string;
}

export const getData = (id: string): Promise<CaptchaDataResponse> => {
  return api.get<CaptchaDataResponse>(apis.getData, { id });
  // return api.get<any>(apis.getData, { id: CAPTCHA_ID_LIST[5] }, {
  //   headers: {
  //     'X-API-Key': CAPTCHA_KEY,
  //   }
  // });
};

export const checkData = (request: CaptchaCheckRequest): Promise<string> => {
  return api.post<string>(apis.checkData, request);
}

export const checkStatus = (captchaKey: string): Promise<string> => {
  return api.get<string>(apis.checkStatus, { captchaKey });
}