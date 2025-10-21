/// 常量
pub const DEPARTMENT_ROOT_ID: i64 = 1; // 根部门id
pub const DEPARTMENT_ROOT_CODE: &str = "0000"; // 根部门code

pub const ROOT_TENANT_ID: i64 = 1; // 跟租户id
pub const ROLE_ID_TENANT_ADMIN: i64 = 2; // 租户管理员角色id

/// 枚举常量
pub const STATUS_ENABLE: i8 = 0; // 状态-启用
pub const STATUS_DISABLE: i8 = 1; // 状态-禁用

pub const PURCHASE_ORDER_STATUS_PLACED: i8 = 0; // 采购订单状态-已下单
pub const PURCHASE_ORDER_STATUS_RECEIVED: i8 = 1; // 采购订单状态-待入库
pub const PURCHASE_ORDER_STATUS_COMPLETE: i8 = 2; // 采购订单状态-已完成
pub const PURCHASE_ORDER_STATUS_CANCEL: i8 = 3; // 采购订单状态-已取消

pub const SALE_ORDER_STATUS_PLACED: i8 = 0; // 销售订单状态-已下单
pub const SALE_ORDER_STATUS_SHIP_OUT: i8 = 1; // 销售订单状态-待出库
pub const SALE_ORDER_STATUS_AWAITING_SIGNATURE: i8 = 2; // 销售订单状态-待签收
pub const SALE_ORDER_STATUS_SIGNED: i8 = 3; // 销售订单状态-已签收
pub const SALE_ORDER_STATUS_COMPLETE: i8 = 4; // 销售订单状态-已完成
pub const SALE_ORDER_STATUS_CANCEL: i8 = 5; // 销售订单状态-已取消
pub const SALE_ORDER_STATUS_RETURN_PROCESSING: i8 = 6; // 销售订单状态-退货处理中
pub const SALE_ORDER_STATUS_RETURN_COMPLETE: i8 = 7; // 销售订单状态-退货完成

pub const PURCHASE_RETURN_STATUS_PLACED: i8 = 0; // 采购退货订单状态-已下单
pub const PURCHASE_RETURN_STATUS_SHIP_OUT: i8 = 1; // 采购退货订单状态-待出库
pub const PURCHASE_RETURN_STATUS_COMPLETE: i8 = 2; // 采购退货订单状态-已完成
pub const PURCHASE_RETURN_STATUS_CANCEL: i8 = 3; // 采购退货订单状态-已取消

pub const SALE_RETURN_STATUS_PLACED: i8 = 0; // 销售退货订单状态-已下单
pub const SALE_RETURN_STATUS_RECEIVED: i8 = 1; // 销售退货订单状态-已收货
pub const SALE_RETURN_STATUS_COMPLETE: i8 = 2; // 销售退货订单状态-已完成
pub const SALE_RETURN_STATUS_CANCEL: i8 = 3; // 销售退货订单状态-已取消

pub const RECORD_TYPE_INBOUND_PURCHASE: i8 = 0; // 记录类型-采购入库
pub const RECORD_TYPE_OUTBOUND_SALE: i8 = 1; // 记录类型-销售出库
pub const RECORD_TYPE_INBOUND_OTHER: i8 = 2; // 记录类型-其他入库
pub const RECORD_TYPE_OUTBOUND_OTHER: i8 = 3; // 记录类型-其他出库
pub const RECORD_TYPE_INBOUND_TRANSFER: i8 = 4; // 记录类型-调拨入库
pub const RECORD_TYPE_OUTBOUND_TRANSFER: i8 = 5; // 记录类型-调拨出库