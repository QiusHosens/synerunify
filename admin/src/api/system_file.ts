import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import request, { api } from "@/utils/request";
import { AxiosProgressEvent, AxiosResponse } from "axios";

const apis = {
  create: "/file/system_file/create", // 新增
  update: "/file/system_file/update", // 修改
  delete: "/file/system_file/delete", // 删除
  get: "/file/system_file/get", // 单条查询
  list: "/file/system_file/list", // 列表查询
  page: "/file/system_file/page", // 分页查询
  upload: "/file/system_file/upload", // 上传
  download: "/file/system_file/download", // 下载
};

export interface SystemFileRequest {
  id: number; // 文件ID
  file_name: string; // 文件名
  file_type: string; // 文件类型
  file_size: number; // 文件大小（字节）
  file_path: string; // 文件存储路径
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface SystemFileResponse {
  id: number; // 文件ID
  file_name: string; // 文件名
  file_type: string; // 文件类型
  file_size: number; // 文件大小（字节）
  file_path: string; // 文件存储路径
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface SystemFileQueryCondition extends PaginatedRequest {}

export const createSystemFile = (
  system_file: SystemFileRequest
): Promise<number> => {
  return api.post<number>(apis.create, system_file);
};

export const updateSystemFile = (
  system_file: SystemFileRequest
): Promise<void> => {
  return api.post<void>(apis.update, system_file);
};

export const deleteSystemFile = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getSystemFile = (id: number): Promise<SystemFileResponse> => {
  return api.get<SystemFileResponse>(`${apis.get}/${id}`);
};

export const listSystemFile = (): Promise<Array<SystemFileResponse>> => {
  return api.get<Array<SystemFileResponse>>(apis.list);
};

export const pageSystemFile = (
  condition: SystemFileQueryCondition
): Promise<PaginatedResponse<SystemFileResponse>> => {
  return api.get<PaginatedResponse<SystemFileResponse>>(apis.page, condition);
};

export const uploadSystemFile = (
  file: File,
  onProgress: (progress: number) => void
): Promise<number> => {
  const formData = new FormData();
  formData.append("file", file);

  return request
    .post<number>(apis.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.debug("upload file percent", percentCompleted);
          onProgress(percentCompleted);
        }
      },
    })
    .then((response: AxiosResponse<number> | number) => {
      const data = typeof response === 'number' ? response : response.data;
      return data;
    });
};
