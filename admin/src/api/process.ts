import { api } from "@/utils/request";
import type { InternalAxiosRequestConfig } from "axios";
import { AxiosHeaders } from "axios";

const apis = {
  detect: "/process/detection/parse_document", // 检测
  image_to_svg: "/process/convert/image_to_svg", // 图片转svg
  stream: "/process/video/stream", // 流式处理
};

export interface DetectRequest {
  source_file: string;
  output_dir: string;
}

export interface DetectResponse {
  width: number;
  height: number;
  path: string;
  json: string;
}

export interface ConvertRequest {
  image: File; // 图片文件
  white_threshold: number; // 白色阈值 (0-255)
  min_area: number; // 最小区域面积
  stroke_width: number; // 描边宽度（像素）
  sharpen_factor: number; // 锐化因子
  enable_upscale: boolean; // 是否启用图片放大
  enable_sharpen: boolean; // 是否启用图片锐化
}

export interface ConvertResponse {
  original_width: number;
  original_height: number;
  upscaled_width: number;
  upscaled_height: number;
  svg_width: number;
  svg_height: number;
  regions_count: number;
  content: string;
}

export const detect = (request: DetectRequest): Promise<DetectResponse> => {
  const config: InternalAxiosRequestConfig = {
    timeout: 1000 * 1000, // 1000s
    headers: new AxiosHeaders(),
  };
  return api.post<DetectResponse>(apis.detect, request, config);
};

export const convert = (request: ConvertRequest): Promise<ConvertResponse> => {
  const formData = new FormData();
  formData.append('image', request.image);
  formData.append('white_threshold', request.white_threshold.toString());
  formData.append('min_area', request.min_area.toString());
  formData.append('stroke_width', request.stroke_width.toString());
  formData.append('sharpen_factor', request.sharpen_factor.toString());
  formData.append('enable_upscale', request.enable_upscale.toString());
  formData.append('enable_sharpen', request.enable_sharpen.toString());

  const config: InternalAxiosRequestConfig = {
    timeout: 1000 * 1000, // 1000s
    headers: new AxiosHeaders(),
  };
  return api.post<ConvertResponse>(apis.image_to_svg, formData, config);
};
