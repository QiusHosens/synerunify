import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_statistics/create', // 新增
  'update': '/mall/mall_trade_statistics/update', // 修改
  'delete': '/mall/mall_trade_statistics/delete', // 删除
  'get': '/mall/mall_trade_statistics/get', // 单条查询
  'list': '/mall/mall_trade_statistics/list', // 列表查询
  'page': '/mall/mall_trade_statistics/page', // 分页查询
};

class MallTradeStatisticsRequest {
  final int id; // 编号，主键自增
  final DateTime time; // 统计日期
  final int orderCreateCount; // 创建订单数
  final int orderPayCount; // 支付订单商品数
  final int orderPayPrice; // 总支付金额，单位：分
  final int afterSaleCount; // 退款订单数
  final int afterSaleRefundPrice; // 总退款金额，单位：分
  final int brokerageSettlementPrice; // 佣金金额（已结算），单位：分
  final int walletPayPrice; // 总支付金额（余额），单位：分
  final int rechargePayCount; // 充值订单数
  final int rechargePayPrice; // 充值金额，单位：分
  final int rechargeRefundCount; // 充值退款订单数
  final int rechargeRefundPrice; // 充值退款金额，单位：分
  

  MallTradeStatisticsRequest({
    required this.id,
    required this.time,
    required this.orderCreateCount,
    required this.orderPayCount,
    required this.orderPayPrice,
    required this.afterSaleCount,
    required this.afterSaleRefundPrice,
    required this.brokerageSettlementPrice,
    required this.walletPayPrice,
    required this.rechargePayCount,
    required this.rechargePayPrice,
    required this.rechargeRefundCount,
    required this.rechargeRefundPrice,
    });

  factory MallTradeStatisticsRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeStatisticsRequest(
      id: json['id'] as int,
      time: json['time'] as DateTime,
      orderCreateCount: json['order_create_count'] as int,
      orderPayCount: json['order_pay_count'] as int,
      orderPayPrice: json['order_pay_price'] as int,
      afterSaleCount: json['after_sale_count'] as int,
      afterSaleRefundPrice: json['after_sale_refund_price'] as int,
      brokerageSettlementPrice: json['brokerage_settlement_price'] as int,
      walletPayPrice: json['wallet_pay_price'] as int,
      rechargePayCount: json['recharge_pay_count'] as int,
      rechargePayPrice: json['recharge_pay_price'] as int,
      rechargeRefundCount: json['recharge_refund_count'] as int,
      rechargeRefundPrice: json['recharge_refund_price'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'time': time,
      'order_create_count': orderCreateCount,
      'order_pay_count': orderPayCount,
      'order_pay_price': orderPayPrice,
      'after_sale_count': afterSaleCount,
      'after_sale_refund_price': afterSaleRefundPrice,
      'brokerage_settlement_price': brokerageSettlementPrice,
      'wallet_pay_price': walletPayPrice,
      'recharge_pay_count': rechargePayCount,
      'recharge_pay_price': rechargePayPrice,
      'recharge_refund_count': rechargeRefundCount,
      'recharge_refund_price': rechargeRefundPrice,
      };
  }
}

class MallTradeStatisticsQueryCondition extends PaginatedRequest {
  MallTradeStatisticsQueryCondition({
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

class MallTradeStatisticsResponse {
  final int id; // 编号，主键自增
  final DateTime time; // 统计日期
  final int orderCreateCount; // 创建订单数
  final int orderPayCount; // 支付订单商品数
  final int orderPayPrice; // 总支付金额，单位：分
  final int afterSaleCount; // 退款订单数
  final int afterSaleRefundPrice; // 总退款金额，单位：分
  final int brokerageSettlementPrice; // 佣金金额（已结算），单位：分
  final int walletPayPrice; // 总支付金额（余额），单位：分
  final int rechargePayCount; // 充值订单数
  final int rechargePayPrice; // 充值金额，单位：分
  final int rechargeRefundCount; // 充值退款订单数
  final int rechargeRefundPrice; // 充值退款金额，单位：分
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeStatisticsResponse({
    required this.id,
    required this.time,
    required this.orderCreateCount,
    required this.orderPayCount,
    required this.orderPayPrice,
    required this.afterSaleCount,
    required this.afterSaleRefundPrice,
    required this.brokerageSettlementPrice,
    required this.walletPayPrice,
    required this.rechargePayCount,
    required this.rechargePayPrice,
    required this.rechargeRefundCount,
    required this.rechargeRefundPrice,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeStatisticsResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeStatisticsResponse(
      id: json['id'] as int,
      time: json['time'] as DateTime,
      orderCreateCount: json['order_create_count'] as int,
      orderPayCount: json['order_pay_count'] as int,
      orderPayPrice: json['order_pay_price'] as int,
      afterSaleCount: json['after_sale_count'] as int,
      afterSaleRefundPrice: json['after_sale_refund_price'] as int,
      brokerageSettlementPrice: json['brokerage_settlement_price'] as int,
      walletPayPrice: json['wallet_pay_price'] as int,
      rechargePayCount: json['recharge_pay_count'] as int,
      rechargePayPrice: json['recharge_pay_price'] as int,
      rechargeRefundCount: json['recharge_refund_count'] as int,
      rechargeRefundPrice: json['recharge_refund_price'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'time': time,
      'order_create_count': orderCreateCount,
      'order_pay_count': orderPayCount,
      'order_pay_price': orderPayPrice,
      'after_sale_count': afterSaleCount,
      'after_sale_refund_price': afterSaleRefundPrice,
      'brokerage_settlement_price': brokerageSettlementPrice,
      'wallet_pay_price': walletPayPrice,
      'recharge_pay_count': rechargePayCount,
      'recharge_pay_price': rechargePayPrice,
      'recharge_refund_count': rechargeRefundCount,
      'recharge_refund_price': rechargeRefundPrice,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeStatisticsService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeStatistics(MallTradeStatisticsRequest mallTradeStatistics) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeStatistics);
    }

    Future<ApiResponse<int>> updateMallTradeStatistics(MallTradeStatisticsRequest mallTradeStatistics) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeStatistics);
    }

    Future<ApiResponse<void>> deleteMallTradeStatistics(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeStatisticsResponse>> getMallTradeStatistics(int id) async {
        return await _httpClient.get<MallTradeStatisticsResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeStatisticsResponse>>> listMallTradeStatistics() async {
        return await _httpClient.get<List<MallTradeStatisticsResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeStatisticsResponse>>> pageMallTradeStatistics(MallTradeStatisticsQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeStatisticsResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}