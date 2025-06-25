import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { UploadFile } from '@/components/CustomizedFileUpload';
import { api } from '@/utils/request';

const apis = {
  create: '/erp/erp_outbound_order_attachment/create', // 新增
  update: '/erp/erp_outbound_order_attachment/update', // 修改
  delete: '/erp/erp_outbound_order_attachment/delete', // 删除
  get: '/erp/erp_outbound_order_attachment/get', // 单条查询
  list: '/erp/erp_outbound_order_attachment/list', // 列表查询
  page: '/erp/erp_outbound_order_attachment/page', // 分页查询
}

export interface ErpOutboundOrderAttachmentRequest {
  id?: number; // 出库订单附件ID
  file_id?: number; // 文件ID
  remarks?: string; // 备注

  file?: UploadFile | null;
}

export interface ErpOutboundOrderAttachmentResponse {
  id: number; // 出库订单附件ID
  order_id: number; // 出库订单ID
  file_id: number; // 文件ID
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpOutboundOrderAttachmentBaseResponse {
  id: number; // 出库订单附件ID
  file_id: number; // 文件ID
  remarks: string; // 备注

  file_name: string; // 文件名
}

export interface ErpOutboundOrderAttachmentQueryCondition extends PaginatedRequest {

}

export const createErpOutboundOrderAttachment = (erp_outbound_order_attachment: ErpOutboundOrderAttachmentRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_outbound_order_attachment);
}

export const updateErpOutboundOrderAttachment = (erp_outbound_order_attachment: ErpOutboundOrderAttachmentRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_outbound_order_attachment);
}

export const deleteErpOutboundOrderAttachment = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpOutboundOrderAttachment = (id: number): Promise<ErpOutboundOrderAttachmentResponse> => {
  return api.get<ErpOutboundOrderAttachmentResponse>(`${apis.get}/${id}`);
}

export const listErpOutboundOrderAttachment = (): Promise<Array<ErpOutboundOrderAttachmentResponse>> => {
  return api.get<Array<ErpOutboundOrderAttachmentResponse>>(apis.list);
}

export const pageErpOutboundOrderAttachment = (condition: ErpOutboundOrderAttachmentQueryCondition): Promise<PaginatedResponse<ErpOutboundOrderAttachmentResponse>> => {
  return api.get<PaginatedResponse<ErpOutboundOrderAttachmentResponse>>(apis.page, condition);
}
