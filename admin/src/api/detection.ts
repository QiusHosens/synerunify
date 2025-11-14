import { api } from "@/utils/request";
import type { InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';

const apis = {
  detect: '/process/parse_document', // 检测
}

export interface DetectRequest {
  source_file: string;
  output_dir: string;
}

export interface DetectResponse {
  path: string;
  json: string;
}

export const detect = (request: DetectRequest): Promise<DetectResponse> => {
  const config: InternalAxiosRequestConfig = {
    timeout: 1000 * 1000, // 1000s
    headers: new AxiosHeaders(),
  };
  return api.post<DetectResponse>(apis.detect, request, config);
};
