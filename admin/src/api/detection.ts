import { api } from "@/utils/request";

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
  return api.post<DetectResponse>(apis.detect, request);
};
