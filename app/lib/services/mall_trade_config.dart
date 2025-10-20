import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_config/create', // 新增
  'update': '/mall/mall_trade_config/update', // 修改
  'delete': '/mall/mall_trade_config/delete', // 删除
  'get': '/mall/mall_trade_config/get', // 单条查询
  'list': '/mall/mall_trade_config/list', // 列表查询
  'page': '/mall/mall_trade_config/page', // 分页查询
};

class MallTradeConfigRequest {
  final int id; // 自增主键
  final String afterSaleRefundReasons; // 售后退款理由
  final String afterSaleReturnReasons; // 售后退货理由
  final bool deliveryExpressFreeEnabled; // 是否启用全场包邮
  final int deliveryExpressFreePrice; // 全场包邮的最小金额，单位：分
  final bool deliveryPickUpEnabled; // 是否开启自提
  final bool brokerageEnabled; // 是否启用分佣
  final int brokerageEnabledCondition; // 分佣模式：1-人人分销 2-指定分销
  final int brokerageBindMode; // 分销关系绑定模式: 1-没有推广人，2-新用户, 3-扫码覆盖
  final String? brokeragePosterUrls; // 分销海报图地址数组
  final int brokerageFirstPercent; // 一级返佣比例
  final int brokerageSecondPercent; // 二级返佣比例
  final int brokerageWithdrawMinPrice; // 用户提现最低金额
  final int brokerageWithdrawFeePercent; // 提现手续费百分比
  final int brokerageFrozenDays; // 佣金冻结时间(天)
  final String brokerageWithdrawTypes; // 提现方式：1-钱包；2-银行卡；3-微信；4-支付宝
  

  MallTradeConfigRequest({
    required this.id,
    required this.afterSaleRefundReasons,
    required this.afterSaleReturnReasons,
    required this.deliveryExpressFreeEnabled,
    required this.deliveryExpressFreePrice,
    required this.deliveryPickUpEnabled,
    required this.brokerageEnabled,
    required this.brokerageEnabledCondition,
    required this.brokerageBindMode,
    this.brokeragePosterUrls,
    required this.brokerageFirstPercent,
    required this.brokerageSecondPercent,
    required this.brokerageWithdrawMinPrice,
    required this.brokerageWithdrawFeePercent,
    required this.brokerageFrozenDays,
    required this.brokerageWithdrawTypes,
    });

  factory MallTradeConfigRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeConfigRequest(
      id: json['id'] as int,
      afterSaleRefundReasons: json['after_sale_refund_reasons'] as String,
      afterSaleReturnReasons: json['after_sale_return_reasons'] as String,
      deliveryExpressFreeEnabled: json['delivery_express_free_enabled'] as bool,
      deliveryExpressFreePrice: json['delivery_express_free_price'] as int,
      deliveryPickUpEnabled: json['delivery_pick_up_enabled'] as bool,
      brokerageEnabled: json['brokerage_enabled'] as bool,
      brokerageEnabledCondition: json['brokerage_enabled_condition'] as int,
      brokerageBindMode: json['brokerage_bind_mode'] as int,
      brokeragePosterUrls: json['brokerage_poster_urls'] as String?,
      brokerageFirstPercent: json['brokerage_first_percent'] as int,
      brokerageSecondPercent: json['brokerage_second_percent'] as int,
      brokerageWithdrawMinPrice: json['brokerage_withdraw_min_price'] as int,
      brokerageWithdrawFeePercent: json['brokerage_withdraw_fee_percent'] as int,
      brokerageFrozenDays: json['brokerage_frozen_days'] as int,
      brokerageWithdrawTypes: json['brokerage_withdraw_types'] as String,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'after_sale_refund_reasons': afterSaleRefundReasons,
      'after_sale_return_reasons': afterSaleReturnReasons,
      'delivery_express_free_enabled': deliveryExpressFreeEnabled,
      'delivery_express_free_price': deliveryExpressFreePrice,
      'delivery_pick_up_enabled': deliveryPickUpEnabled,
      'brokerage_enabled': brokerageEnabled,
      'brokerage_enabled_condition': brokerageEnabledCondition,
      'brokerage_bind_mode': brokerageBindMode,
      'brokerage_poster_urls': brokeragePosterUrls,
      'brokerage_first_percent': brokerageFirstPercent,
      'brokerage_second_percent': brokerageSecondPercent,
      'brokerage_withdraw_min_price': brokerageWithdrawMinPrice,
      'brokerage_withdraw_fee_percent': brokerageWithdrawFeePercent,
      'brokerage_frozen_days': brokerageFrozenDays,
      'brokerage_withdraw_types': brokerageWithdrawTypes,
      };
  }
}

class MallTradeConfigQueryCondition extends PaginatedRequest {
  MallTradeConfigQueryCondition({
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

class MallTradeConfigResponse {
  final int id; // 自增主键
  final String afterSaleRefundReasons; // 售后退款理由
  final String afterSaleReturnReasons; // 售后退货理由
  final bool deliveryExpressFreeEnabled; // 是否启用全场包邮
  final int deliveryExpressFreePrice; // 全场包邮的最小金额，单位：分
  final bool deliveryPickUpEnabled; // 是否开启自提
  final bool brokerageEnabled; // 是否启用分佣
  final int brokerageEnabledCondition; // 分佣模式：1-人人分销 2-指定分销
  final int brokerageBindMode; // 分销关系绑定模式: 1-没有推广人，2-新用户, 3-扫码覆盖
  final String? brokeragePosterUrls; // 分销海报图地址数组
  final int brokerageFirstPercent; // 一级返佣比例
  final int brokerageSecondPercent; // 二级返佣比例
  final int brokerageWithdrawMinPrice; // 用户提现最低金额
  final int brokerageWithdrawFeePercent; // 提现手续费百分比
  final int brokerageFrozenDays; // 佣金冻结时间(天)
  final String brokerageWithdrawTypes; // 提现方式：1-钱包；2-银行卡；3-微信；4-支付宝
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeConfigResponse({
    required this.id,
    required this.afterSaleRefundReasons,
    required this.afterSaleReturnReasons,
    required this.deliveryExpressFreeEnabled,
    required this.deliveryExpressFreePrice,
    required this.deliveryPickUpEnabled,
    required this.brokerageEnabled,
    required this.brokerageEnabledCondition,
    required this.brokerageBindMode,
    this.brokeragePosterUrls,
    required this.brokerageFirstPercent,
    required this.brokerageSecondPercent,
    required this.brokerageWithdrawMinPrice,
    required this.brokerageWithdrawFeePercent,
    required this.brokerageFrozenDays,
    required this.brokerageWithdrawTypes,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeConfigResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeConfigResponse(
      id: json['id'] as int,
      afterSaleRefundReasons: json['after_sale_refund_reasons'] as String,
      afterSaleReturnReasons: json['after_sale_return_reasons'] as String,
      deliveryExpressFreeEnabled: json['delivery_express_free_enabled'] as bool,
      deliveryExpressFreePrice: json['delivery_express_free_price'] as int,
      deliveryPickUpEnabled: json['delivery_pick_up_enabled'] as bool,
      brokerageEnabled: json['brokerage_enabled'] as bool,
      brokerageEnabledCondition: json['brokerage_enabled_condition'] as int,
      brokerageBindMode: json['brokerage_bind_mode'] as int,
      brokeragePosterUrls: json['brokerage_poster_urls'] as String?,
      brokerageFirstPercent: json['brokerage_first_percent'] as int,
      brokerageSecondPercent: json['brokerage_second_percent'] as int,
      brokerageWithdrawMinPrice: json['brokerage_withdraw_min_price'] as int,
      brokerageWithdrawFeePercent: json['brokerage_withdraw_fee_percent'] as int,
      brokerageFrozenDays: json['brokerage_frozen_days'] as int,
      brokerageWithdrawTypes: json['brokerage_withdraw_types'] as String,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'after_sale_refund_reasons': afterSaleRefundReasons,
      'after_sale_return_reasons': afterSaleReturnReasons,
      'delivery_express_free_enabled': deliveryExpressFreeEnabled,
      'delivery_express_free_price': deliveryExpressFreePrice,
      'delivery_pick_up_enabled': deliveryPickUpEnabled,
      'brokerage_enabled': brokerageEnabled,
      'brokerage_enabled_condition': brokerageEnabledCondition,
      'brokerage_bind_mode': brokerageBindMode,
      'brokerage_poster_urls': brokeragePosterUrls,
      'brokerage_first_percent': brokerageFirstPercent,
      'brokerage_second_percent': brokerageSecondPercent,
      'brokerage_withdraw_min_price': brokerageWithdrawMinPrice,
      'brokerage_withdraw_fee_percent': brokerageWithdrawFeePercent,
      'brokerage_frozen_days': brokerageFrozenDays,
      'brokerage_withdraw_types': brokerageWithdrawTypes,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeConfigService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeConfig(MallTradeConfigRequest mallTradeConfig) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeConfig);
    }

    Future<ApiResponse<int>> updateMallTradeConfig(MallTradeConfigRequest mallTradeConfig) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeConfig);
    }

    Future<ApiResponse<void>> deleteMallTradeConfig(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeConfigResponse>> getMallTradeConfig(int id) async {
        return await _httpClient.get<MallTradeConfigResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeConfigResponse>>> listMallTradeConfig() async {
        return await _httpClient.get<List<MallTradeConfigResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeConfigResponse>>> pageMallTradeConfig(MallTradeConfigQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeConfigResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}