import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_statistics/create', // 新增
  'update': '/mall/mall_product_statistics/update', // 修改
  'delete': '/mall/mall_product_statistics/delete', // 删除
  'get': '/mall/mall_product_statistics/get', // 单条查询
  'list': '/mall/mall_product_statistics/list', // 列表查询
  'page': '/mall/mall_product_statistics/page', // 分页查询
};

class MallProductStatisticsRequest {
  final int id; // 编号，主键自增
  final DateTime time; // 统计日期
  final int spuId; // 商品 SPU 编号
  final int browseCount; // 浏览量
  final int browseUserCount; // 访客量
  final int favoriteCount; // 收藏数量
  final int cartCount; // 加购数量
  final int orderCount; // 下单件数
  final int orderPayCount; // 支付件数
  final int orderPayPrice; // 支付金额，单位：分
  final int afterSaleCount; // 退款件数
  final int afterSaleRefundPrice; // 退款金额，单位：分
  final int browseConvertPercent; // 访客支付转化率（百分比）
  

  MallProductStatisticsRequest({
    required this.id,
    required this.time,
    required this.spuId,
    required this.browseCount,
    required this.browseUserCount,
    required this.favoriteCount,
    required this.cartCount,
    required this.orderCount,
    required this.orderPayCount,
    required this.orderPayPrice,
    required this.afterSaleCount,
    required this.afterSaleRefundPrice,
    required this.browseConvertPercent,
    });

  factory MallProductStatisticsRequest.fromJson(Map<String, dynamic> json) {
    return MallProductStatisticsRequest(
      id: json['id'] as int,
      time: json['time'] as DateTime,
      spuId: json['spu_id'] as int,
      browseCount: json['browse_count'] as int,
      browseUserCount: json['browse_user_count'] as int,
      favoriteCount: json['favorite_count'] as int,
      cartCount: json['cart_count'] as int,
      orderCount: json['order_count'] as int,
      orderPayCount: json['order_pay_count'] as int,
      orderPayPrice: json['order_pay_price'] as int,
      afterSaleCount: json['after_sale_count'] as int,
      afterSaleRefundPrice: json['after_sale_refund_price'] as int,
      browseConvertPercent: json['browse_convert_percent'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'time': time,
      'spu_id': spuId,
      'browse_count': browseCount,
      'browse_user_count': browseUserCount,
      'favorite_count': favoriteCount,
      'cart_count': cartCount,
      'order_count': orderCount,
      'order_pay_count': orderPayCount,
      'order_pay_price': orderPayPrice,
      'after_sale_count': afterSaleCount,
      'after_sale_refund_price': afterSaleRefundPrice,
      'browse_convert_percent': browseConvertPercent,
      };
  }
}

class MallProductStatisticsQueryCondition extends PaginatedRequest {
  MallProductStatisticsQueryCondition({
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

class MallProductStatisticsResponse {
  final int id; // 编号，主键自增
  final DateTime time; // 统计日期
  final int spuId; // 商品 SPU 编号
  final int browseCount; // 浏览量
  final int browseUserCount; // 访客量
  final int favoriteCount; // 收藏数量
  final int cartCount; // 加购数量
  final int orderCount; // 下单件数
  final int orderPayCount; // 支付件数
  final int orderPayPrice; // 支付金额，单位：分
  final int afterSaleCount; // 退款件数
  final int afterSaleRefundPrice; // 退款金额，单位：分
  final int browseConvertPercent; // 访客支付转化率（百分比）
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallProductStatisticsResponse({
    required this.id,
    required this.time,
    required this.spuId,
    required this.browseCount,
    required this.browseUserCount,
    required this.favoriteCount,
    required this.cartCount,
    required this.orderCount,
    required this.orderPayCount,
    required this.orderPayPrice,
    required this.afterSaleCount,
    required this.afterSaleRefundPrice,
    required this.browseConvertPercent,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallProductStatisticsResponse.fromJson(Map<String, dynamic> json) {
    return MallProductStatisticsResponse(
      id: json['id'] as int,
      time: json['time'] as DateTime,
      spuId: json['spu_id'] as int,
      browseCount: json['browse_count'] as int,
      browseUserCount: json['browse_user_count'] as int,
      favoriteCount: json['favorite_count'] as int,
      cartCount: json['cart_count'] as int,
      orderCount: json['order_count'] as int,
      orderPayCount: json['order_pay_count'] as int,
      orderPayPrice: json['order_pay_price'] as int,
      afterSaleCount: json['after_sale_count'] as int,
      afterSaleRefundPrice: json['after_sale_refund_price'] as int,
      browseConvertPercent: json['browse_convert_percent'] as int,
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
      'spu_id': spuId,
      'browse_count': browseCount,
      'browse_user_count': browseUserCount,
      'favorite_count': favoriteCount,
      'cart_count': cartCount,
      'order_count': orderCount,
      'order_pay_count': orderPayCount,
      'order_pay_price': orderPayPrice,
      'after_sale_count': afterSaleCount,
      'after_sale_refund_price': afterSaleRefundPrice,
      'browse_convert_percent': browseConvertPercent,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallProductStatisticsService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductStatistics(MallProductStatisticsRequest mallProductStatistics) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductStatistics);
    }

    Future<ApiResponse<int>> updateMallProductStatistics(MallProductStatisticsRequest mallProductStatistics) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductStatistics);
    }

    Future<ApiResponse<void>> deleteMallProductStatistics(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductStatisticsResponse>> getMallProductStatistics(int id) async {
        return await _httpClient.get<MallProductStatisticsResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductStatisticsResponse>>> listMallProductStatistics() async {
        return await _httpClient.get<List<MallProductStatisticsResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductStatisticsResponse>>> pageMallProductStatistics(MallProductStatisticsQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductStatisticsResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}