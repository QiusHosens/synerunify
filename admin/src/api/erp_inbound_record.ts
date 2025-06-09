import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_inbound_record/create', // 新增
  update: '/erp_inbound_record/update', // 修改
  delete: '/erp_inbound_record/delete', // 删除
  get: '/erp_inbound_record/get', // 单条查询
  list: '/erp_inbound_record/list', // 列表查询
  page: '/erp_inbound_record/page', // 分页查询
}

export interface ErpInboundRecordRequest {
  id: number; // 入库记录ID
  purchase_id: number; // 采购订单ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  quantity: number; // 入库数量
  inbound_date: string; // 入库日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpInboundRecordResponse {
  id: number; // 入库记录ID
  purchase_id: number; // 采购订单ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  quantity: number; // 入库数量
  inbound_date: string; // 入库日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpInboundRecordQueryCondition extends PaginatedRequest {

}

export const createErpInboundRecord = (erp_inbound_record: ErpInboundRecordRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_inbound_record);
}

export const updateErpInboundRecord = (erp_inbound_record: ErpInboundRecordRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_inbound_record);
}

export const deleteErpInboundRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpInboundRecord = (id: number): Promise<ErpInboundRecordResponse> => {
  return api.get<ErpInboundRecordResponse>(`${apis.get}/${id}`);
}

export const listErpInboundRecord = (): Promise<Array<ErpInboundRecordResponse>> => {
  return api.get<Array<ErpInboundRecordResponse>>(apis.list);
}

export const pageErpInboundRecord = (condition: ErpInboundRecordQueryCondition): Promise<PaginatedResponse<ErpInboundRecordResponse>> => {
  return api.get<PaginatedResponse<ErpInboundRecordResponse>>(apis.page, condition);
}
