import { PaginatedRequest, PaginatedResponse } from "@/base/page";
import { UploadFile } from "@/components/CustomizedFileUpload";
import { api } from "@/utils/request";

const apis = {
  create: "/erp/erp_inbound_order_attachment/create", // 新增
  update: "/erp/erp_inbound_order_attachment/update", // 修改
  delete: "/erp/erp_inbound_order_attachment/delete", // 删除
  get: "/erp/erp_inbound_order_attachment/get", // 单条查询
  list: "/erp/erp_inbound_order_attachment/list", // 列表查询
  page: "/erp/erp_inbound_order_attachment/page", // 分页查询
};

export interface ErpInboundOrderAttachmentRequest {
  id?: number; // 入库订单附件ID
  order_id?: number; // 入库订单ID
  file_id?: number; // 文件ID
  remarks?: string; // 备注

  file?: UploadFile | null;
}

export interface ErpInboundOrderAttachmentResponse {
  id: number; // 入库订单附件ID
  order_id: number; // 入库订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInboundOrderAttachmentBaseResponse {
  id: number; // 入库订单附件ID
  order_id: number; // 入库订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注

  file_name: string; // 文件名
}

export interface ErpInboundOrderAttachmentQueryCondition
  extends PaginatedRequest {}

export const createErpInboundOrderAttachment = (
  erp_inbound_order_attachment: ErpInboundOrderAttachmentRequest
): Promise<number> => {
  return api.post<number>(apis.create, erp_inbound_order_attachment);
};

export const updateErpInboundOrderAttachment = (
  erp_inbound_order_attachment: ErpInboundOrderAttachmentRequest
): Promise<void> => {
  return api.post<void>(apis.update, erp_inbound_order_attachment);
};

export const deleteErpInboundOrderAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
};

export const getErpInboundOrderAttachment = (
  id: number
): Promise<ErpInboundOrderAttachmentResponse> => {
  return api.get<ErpInboundOrderAttachmentResponse>(`${apis.get}/${id}`);
};

export const listErpInboundOrderAttachment = (): Promise<
  Array<ErpInboundOrderAttachmentResponse>
> => {
  return api.get<Array<ErpInboundOrderAttachmentResponse>>(apis.list);
};

export const pageErpInboundOrderAttachment = (
  condition: ErpInboundOrderAttachmentQueryCondition
): Promise<PaginatedResponse<ErpInboundOrderAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpInboundOrderAttachmentResponse>>(
    apis.page,
    condition
  );
};
