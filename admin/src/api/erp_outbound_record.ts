import { PaginatedRequest, PaginatedResponse } from '@/base/page';
import { api } from '@/utils/request';

const apis = {
  create: '/erp_outbound_record/create', // 新增
  update: '/erp_outbound_record/update', // 修改
  delete: '/erp_outbound_record/delete', // 删除
  get: '/erp_outbound_record/get', // 单条查询
  list: '/erp_outbound_record/list', // 列表查询
  page: '/erp_outbound_record/page', // 分页查询
}

export interface ErpOutboundRecordRequest {
  id: number; // 出库记录ID
  order_id: number; // 销售订单ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  quantity: number; // 出库数量
  outbound_date: string; // 出库日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
}

export interface ErpOutboundRecordResponse {
  id: number; // 出库记录ID
  order_id: number; // 销售订单ID
  warehouse_id: number; // 仓库ID
  product_id: number; // 产品ID
  quantity: number; // 出库数量
  outbound_date: string; // 出库日期
  remarks: string; // 备注
  department_code: string; // 部门编码
  department_id: number; // 部门ID
  creator: number; // 创建者ID
  create_time: string; // 创建时间
  updater: number; // 更新者ID
  update_time: string; // 更新时间
}

export interface ErpOutboundRecordQueryCondition extends PaginatedRequest {

}

export const createErpOutboundRecord = (erp_outbound_record: ErpOutboundRecordRequest): Promise<number> => {
  return api.post<number>(apis.create, erp_outbound_record);
}

export const updateErpOutboundRecord = (erp_outbound_record: ErpOutboundRecordRequest): Promise<void> => {
  return api.post<void>(apis.update, erp_outbound_record);
}

export const deleteErpOutboundRecord = (id: number): Promise<void> => {
  return api.post<void>(`${apis.delete}/${id}`);
}

export const getErpOutboundRecord = (id: number): Promise<ErpOutboundRecordResponse> => {
  return api.get<ErpOutboundRecordResponse>(`${apis.get}/${id}`);
}

export const listErpOutboundRecord = (): Promise<Array<ErpOutboundRecordResponse>> => {
  return api.get<Array<ErpOutboundRecordResponse>>(apis.list);
}

export const pageErpOutboundRecord = (condition: ErpOutboundRecordQueryCondition): Promise<PaginatedResponse<ErpOutboundRecordResponse>> => {
  return api.get<PaginatedResponse<ErpOutboundRecordResponse>>(apis.page, condition);
}
