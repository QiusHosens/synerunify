import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_after_sale/create', // 新增
  'update': '/mall/mall_trade_after_sale/update', // 修改
  'delete': '/mall/mall_trade_after_sale/delete', // 删除
  'get': '/mall/mall_trade_after_sale/get', // 单条查询
  'list': '/mall/mall_trade_after_sale/list', // 列表查询
  'page': '/mall/mall_trade_after_sale/page', // 分页查询
  'enable': '/mall/mall_trade_after_sale/enable', // 启用
  'disable': '/mall/mall_trade_after_sale/disable', // 禁用
};

class MallTradeAfterSaleRequest {
  final int id; // 售后编号
  final String no; // 售后单号
  final int? type; // 售后类型
  final int status; // 售后状态
  final int way; // 售后方式
  final int userId; // 用户编号
  final String applyReason; // 申请原因
  final String? applyDescription; // 补充描述
  final String? applyFileIds; // 补充凭证图片
  final int orderId; // 订单编号
  final String orderNo; // 订单流水号
  final int orderItemId; // 订单项编号
  final int spuId; // 商品 SPU 编号
  final String spuName; // 商品 SPU 名称
  final int skuId; // 商品 SKU 编号
  final String? properties; // 商品属性数组，JSON 格式
  final int fileId; // 商品图片ID
  final int count; // 购买数量
  final DateTime? auditTime; // 审批时间
  final int? auditUserId; // 审批人
  final String? auditReason; // 审批备注
  final int refundPrice; // 退款金额，单位：分
  final int? payRefundId; // 支付退款编号
  final DateTime? refundTime; // 退款时间
  final int? logisticsId; // 退货物流公司编号
  final String? logisticsNo; // 退货物流单号
  final DateTime? deliveryTime; // 退货时间
  final DateTime? receiveTime; // 收货时间
  final String? receiveReason; // 收货备注

  MallTradeAfterSaleRequest({
    required this.id,
    required this.no,
    this.type,
    required this.status,
    required this.way,
    required this.userId,
    required this.applyReason,
    this.applyDescription,
    this.applyFileIds,
    required this.orderId,
    required this.orderNo,
    required this.orderItemId,
    required this.spuId,
    required this.spuName,
    required this.skuId,
    this.properties,
    required this.fileId,
    required this.count,
    this.auditTime,
    this.auditUserId,
    this.auditReason,
    required this.refundPrice,
    this.payRefundId,
    this.refundTime,
    this.logisticsId,
    this.logisticsNo,
    this.deliveryTime,
    this.receiveTime,
    this.receiveReason,
  });

  factory MallTradeAfterSaleRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeAfterSaleRequest(
      id: json['id'] as int,
      no: json['no'] as String,
      type: json['type'] as int?,
      status: json['status'] as int,
      way: json['way'] as int,
      userId: json['user_id'] as int,
      applyReason: json['apply_reason'] as String,
      applyDescription: json['apply_description'] as String?,
      applyFileIds: json['apply_file_ids'] as String?,
      orderId: json['order_id'] as int,
      orderNo: json['order_no'] as String,
      orderItemId: json['order_item_id'] as int,
      spuId: json['spu_id'] as int,
      spuName: json['spu_name'] as String,
      skuId: json['sku_id'] as int,
      properties: json['properties'] as String?,
      fileId: json['file_id'] as int,
      count: json['count'] as int,
      auditTime: json['audit_time'] as DateTime?,
      auditUserId: json['audit_user_id'] as int?,
      auditReason: json['audit_reason'] as String?,
      refundPrice: json['refund_price'] as int,
      payRefundId: json['pay_refund_id'] as int?,
      refundTime: json['refund_time'] as DateTime?,
      logisticsId: json['logistics_id'] as int?,
      logisticsNo: json['logistics_no'] as String?,
      deliveryTime: json['delivery_time'] as DateTime?,
      receiveTime: json['receive_time'] as DateTime?,
      receiveReason: json['receive_reason'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'no': no,
      'type': type,
      'status': status,
      'way': way,
      'user_id': userId,
      'apply_reason': applyReason,
      'apply_description': applyDescription,
      'apply_file_ids': applyFileIds,
      'order_id': orderId,
      'order_no': orderNo,
      'order_item_id': orderItemId,
      'spu_id': spuId,
      'spu_name': spuName,
      'sku_id': skuId,
      'properties': properties,
      'file_id': fileId,
      'count': count,
      'audit_time': auditTime,
      'audit_user_id': auditUserId,
      'audit_reason': auditReason,
      'refund_price': refundPrice,
      'pay_refund_id': payRefundId,
      'refund_time': refundTime,
      'logistics_id': logisticsId,
      'logistics_no': logisticsNo,
      'delivery_time': deliveryTime,
      'receive_time': receiveTime,
      'receive_reason': receiveReason,
    };
  }
}

class MallTradeAfterSaleQueryCondition extends PaginatedRequest {
  MallTradeAfterSaleQueryCondition({
    required int page,
    required int size,
    String? keyword,
    String? sortField,
    String? sort,
    String? filterField,
    String? filterOperator,
    String? filterValue,
  }) : super(
         page: page,
         size: size,
         keyword: keyword,
         sortField: sortField,
         sort: sort,
         filterField: filterField,
         filterOperator: filterOperator,
         filterValue: filterValue,
       );
}

class MallTradeAfterSaleResponse {
  final int id; // 售后编号
  final String no; // 售后单号
  final int? type; // 售后类型
  final int status; // 售后状态
  final int way; // 售后方式
  final int userId; // 用户编号
  final String applyReason; // 申请原因
  final String? applyDescription; // 补充描述
  final String? applyFileIds; // 补充凭证图片
  final int orderId; // 订单编号
  final String orderNo; // 订单流水号
  final int orderItemId; // 订单项编号
  final int spuId; // 商品 SPU 编号
  final String spuName; // 商品 SPU 名称
  final int skuId; // 商品 SKU 编号
  final String? properties; // 商品属性数组，JSON 格式
  final int fileId; // 商品图片ID
  final int count; // 购买数量
  final DateTime? auditTime; // 审批时间
  final int? auditUserId; // 审批人
  final String? auditReason; // 审批备注
  final int refundPrice; // 退款金额，单位：分
  final int? payRefundId; // 支付退款编号
  final DateTime? refundTime; // 退款时间
  final int? logisticsId; // 退货物流公司编号
  final String? logisticsNo; // 退货物流单号
  final DateTime? deliveryTime; // 退货时间
  final DateTime? receiveTime; // 收货时间
  final String? receiveReason; // 收货备注
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeAfterSaleResponse({
    required this.id,
    required this.no,
    this.type,
    required this.status,
    required this.way,
    required this.userId,
    required this.applyReason,
    this.applyDescription,
    this.applyFileIds,
    required this.orderId,
    required this.orderNo,
    required this.orderItemId,
    required this.spuId,
    required this.spuName,
    required this.skuId,
    this.properties,
    required this.fileId,
    required this.count,
    this.auditTime,
    this.auditUserId,
    this.auditReason,
    required this.refundPrice,
    this.payRefundId,
    this.refundTime,
    this.logisticsId,
    this.logisticsNo,
    this.deliveryTime,
    this.receiveTime,
    this.receiveReason,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
  });

  factory MallTradeAfterSaleResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeAfterSaleResponse(
      id: json['id'] as int,
      no: json['no'] as String,
      type: json['type'] as int?,
      status: json['status'] as int,
      way: json['way'] as int,
      userId: json['user_id'] as int,
      applyReason: json['apply_reason'] as String,
      applyDescription: json['apply_description'] as String?,
      applyFileIds: json['apply_file_ids'] as String?,
      orderId: json['order_id'] as int,
      orderNo: json['order_no'] as String,
      orderItemId: json['order_item_id'] as int,
      spuId: json['spu_id'] as int,
      spuName: json['spu_name'] as String,
      skuId: json['sku_id'] as int,
      properties: json['properties'] as String?,
      fileId: json['file_id'] as int,
      count: json['count'] as int,
      auditTime: json['audit_time'] as DateTime?,
      auditUserId: json['audit_user_id'] as int?,
      auditReason: json['audit_reason'] as String?,
      refundPrice: json['refund_price'] as int,
      payRefundId: json['pay_refund_id'] as int?,
      refundTime: json['refund_time'] as DateTime?,
      logisticsId: json['logistics_id'] as int?,
      logisticsNo: json['logistics_no'] as String?,
      deliveryTime: json['delivery_time'] as DateTime?,
      receiveTime: json['receive_time'] as DateTime?,
      receiveReason: json['receive_reason'] as String?,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'no': no,
      'type': type,
      'status': status,
      'way': way,
      'user_id': userId,
      'apply_reason': applyReason,
      'apply_description': applyDescription,
      'apply_file_ids': applyFileIds,
      'order_id': orderId,
      'order_no': orderNo,
      'order_item_id': orderItemId,
      'spu_id': spuId,
      'spu_name': spuName,
      'sku_id': skuId,
      'properties': properties,
      'file_id': fileId,
      'count': count,
      'audit_time': auditTime,
      'audit_user_id': auditUserId,
      'audit_reason': auditReason,
      'refund_price': refundPrice,
      'pay_refund_id': payRefundId,
      'refund_time': refundTime,
      'logistics_id': logisticsId,
      'logistics_no': logisticsNo,
      'delivery_time': deliveryTime,
      'receive_time': receiveTime,
      'receive_reason': receiveReason,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
    };
  }
}

class MallTradeAfterSaleService {
  final HttpClient _httpClient = HttpClient();

  Future<ApiResponse<int>> createMallTradeAfterSale(
    MallTradeAfterSaleRequest mallTradeAfterSale,
  ) async {
    return await _httpClient.post<int>(
      apis['create']!,
      data: mallTradeAfterSale,
    );
  }

  Future<ApiResponse<int>> updateMallTradeAfterSale(
    MallTradeAfterSaleRequest mallTradeAfterSale,
  ) async {
    return await _httpClient.post<int>(
      apis['update']!,
      data: mallTradeAfterSale,
    );
  }

  Future<ApiResponse<void>> deleteMallTradeAfterSale(int id) async {
    return await _httpClient.post<void>('${apis['delete']!}/$id');
  }

  Future<ApiResponse<MallTradeAfterSaleResponse>> getMallTradeAfterSale(
    int id,
  ) async {
    return await _httpClient.get<MallTradeAfterSaleResponse>(
      '${apis['get']!}/$id',
    );
  }

  Future<ApiResponse<List<MallTradeAfterSaleResponse>>>
  listMallTradeAfterSale() async {
    return await _httpClient.get<List<MallTradeAfterSaleResponse>>(
      apis['list']!,
    );
  }

  Future<ApiResponse<PaginatedResponse<MallTradeAfterSaleResponse>>>
  pageMallTradeAfterSale(MallTradeAfterSaleQueryCondition condition) async {
    return await _httpClient.get<PaginatedResponse<MallTradeAfterSaleResponse>>(
      apis['page']!,
      queryParameters: condition.toJson(),
    );
  }

  Future<ApiResponse<void>> enableMallTradeAfterSale(int id) async {
    return await _httpClient.post<void>('${apis['enable']!}/$id');
  }

  Future<ApiResponse<void>> disableMallTradeAfterSale(int id) async {
    return await _httpClient.post<void>('${apis['disable']!}/$id');
  }
}
