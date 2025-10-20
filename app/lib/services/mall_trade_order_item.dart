import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_order_item/create', // 新增
  'update': '/mall/mall_trade_order_item/update', // 修改
  'delete': '/mall/mall_trade_order_item/delete', // 删除
  'get': '/mall/mall_trade_order_item/get', // 单条查询
  'list': '/mall/mall_trade_order_item/list', // 列表查询
  'page': '/mall/mall_trade_order_item/page', // 分页查询
};

class MallTradeOrderItemRequest {
  final int id; // 订单项编号
  final int userId; // 用户编号
  final int orderId; // 订单编号
  final int? cartId; // 购物车项编号
  final int spuId; // 商品 SPU 编号
  final String spuName; // 商品 SPU 名称
  final int skuId; // 商品 SKU 编号
  final String? properties; // 商品属性数组，JSON 格式
  final int fileId; // 商品图片ID
  final int count; // 购买数量
  final bool commentStatus; // 是否评价
  final int price; // 商品原价（单），单位：分
  final int discountPrice; // 商品级优惠（总），单位：分
  final int deliveryPrice; // 运费金额，单位：分
  final int adjustPrice; // 订单调价（总），单位：分
  final int payPrice; // 子订单实付金额（总），不算主订单分摊金额，单位：分
  final int couponPrice; // 优惠劵减免金额，单位：分
  final int pointPrice; // 积分抵扣的金额
  final int usePoint; // 使用的积分
  final int givePoint; // 赠送的积分
  final int vipPrice; // VIP 减免金额，单位：分
  final int? afterSaleId; // 售后订单编号
  final int afterSaleStatus; // 售后状态
  

  MallTradeOrderItemRequest({
    required this.id,
    required this.userId,
    required this.orderId,
    this.cartId,
    required this.spuId,
    required this.spuName,
    required this.skuId,
    this.properties,
    required this.fileId,
    required this.count,
    required this.commentStatus,
    required this.price,
    required this.discountPrice,
    required this.deliveryPrice,
    required this.adjustPrice,
    required this.payPrice,
    required this.couponPrice,
    required this.pointPrice,
    required this.usePoint,
    required this.givePoint,
    required this.vipPrice,
    this.afterSaleId,
    required this.afterSaleStatus,
    });

  factory MallTradeOrderItemRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeOrderItemRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      orderId: json['order_id'] as int,
      cartId: json['cart_id'] as int?,
      spuId: json['spu_id'] as int,
      spuName: json['spu_name'] as String,
      skuId: json['sku_id'] as int,
      properties: json['properties'] as String?,
      fileId: json['file_id'] as int,
      count: json['count'] as int,
      commentStatus: json['comment_status'] as bool,
      price: json['price'] as int,
      discountPrice: json['discount_price'] as int,
      deliveryPrice: json['delivery_price'] as int,
      adjustPrice: json['adjust_price'] as int,
      payPrice: json['pay_price'] as int,
      couponPrice: json['coupon_price'] as int,
      pointPrice: json['point_price'] as int,
      usePoint: json['use_point'] as int,
      givePoint: json['give_point'] as int,
      vipPrice: json['vip_price'] as int,
      afterSaleId: json['after_sale_id'] as int?,
      afterSaleStatus: json['after_sale_status'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'order_id': orderId,
      'cart_id': cartId,
      'spu_id': spuId,
      'spu_name': spuName,
      'sku_id': skuId,
      'properties': properties,
      'file_id': fileId,
      'count': count,
      'comment_status': commentStatus,
      'price': price,
      'discount_price': discountPrice,
      'delivery_price': deliveryPrice,
      'adjust_price': adjustPrice,
      'pay_price': payPrice,
      'coupon_price': couponPrice,
      'point_price': pointPrice,
      'use_point': usePoint,
      'give_point': givePoint,
      'vip_price': vipPrice,
      'after_sale_id': afterSaleId,
      'after_sale_status': afterSaleStatus,
      };
  }
}

class MallTradeOrderItemQueryCondition extends PaginatedRequest {
  MallTradeOrderItemQueryCondition({
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

class MallTradeOrderItemResponse {
  final int id; // 订单项编号
  final int userId; // 用户编号
  final int orderId; // 订单编号
  final int? cartId; // 购物车项编号
  final int spuId; // 商品 SPU 编号
  final String spuName; // 商品 SPU 名称
  final int skuId; // 商品 SKU 编号
  final String? properties; // 商品属性数组，JSON 格式
  final int fileId; // 商品图片ID
  final int count; // 购买数量
  final bool commentStatus; // 是否评价
  final int price; // 商品原价（单），单位：分
  final int discountPrice; // 商品级优惠（总），单位：分
  final int deliveryPrice; // 运费金额，单位：分
  final int adjustPrice; // 订单调价（总），单位：分
  final int payPrice; // 子订单实付金额（总），不算主订单分摊金额，单位：分
  final int couponPrice; // 优惠劵减免金额，单位：分
  final int pointPrice; // 积分抵扣的金额
  final int usePoint; // 使用的积分
  final int givePoint; // 赠送的积分
  final int vipPrice; // VIP 减免金额，单位：分
  final int? afterSaleId; // 售后订单编号
  final int afterSaleStatus; // 售后状态
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeOrderItemResponse({
    required this.id,
    required this.userId,
    required this.orderId,
    this.cartId,
    required this.spuId,
    required this.spuName,
    required this.skuId,
    this.properties,
    required this.fileId,
    required this.count,
    required this.commentStatus,
    required this.price,
    required this.discountPrice,
    required this.deliveryPrice,
    required this.adjustPrice,
    required this.payPrice,
    required this.couponPrice,
    required this.pointPrice,
    required this.usePoint,
    required this.givePoint,
    required this.vipPrice,
    this.afterSaleId,
    required this.afterSaleStatus,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeOrderItemResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeOrderItemResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      orderId: json['order_id'] as int,
      cartId: json['cart_id'] as int?,
      spuId: json['spu_id'] as int,
      spuName: json['spu_name'] as String,
      skuId: json['sku_id'] as int,
      properties: json['properties'] as String?,
      fileId: json['file_id'] as int,
      count: json['count'] as int,
      commentStatus: json['comment_status'] as bool,
      price: json['price'] as int,
      discountPrice: json['discount_price'] as int,
      deliveryPrice: json['delivery_price'] as int,
      adjustPrice: json['adjust_price'] as int,
      payPrice: json['pay_price'] as int,
      couponPrice: json['coupon_price'] as int,
      pointPrice: json['point_price'] as int,
      usePoint: json['use_point'] as int,
      givePoint: json['give_point'] as int,
      vipPrice: json['vip_price'] as int,
      afterSaleId: json['after_sale_id'] as int?,
      afterSaleStatus: json['after_sale_status'] as int,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'order_id': orderId,
      'cart_id': cartId,
      'spu_id': spuId,
      'spu_name': spuName,
      'sku_id': skuId,
      'properties': properties,
      'file_id': fileId,
      'count': count,
      'comment_status': commentStatus,
      'price': price,
      'discount_price': discountPrice,
      'delivery_price': deliveryPrice,
      'adjust_price': adjustPrice,
      'pay_price': payPrice,
      'coupon_price': couponPrice,
      'point_price': pointPrice,
      'use_point': usePoint,
      'give_point': givePoint,
      'vip_price': vipPrice,
      'after_sale_id': afterSaleId,
      'after_sale_status': afterSaleStatus,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeOrderItemService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeOrderItem(MallTradeOrderItemRequest mallTradeOrderItem) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeOrderItem);
    }

    Future<ApiResponse<int>> updateMallTradeOrderItem(MallTradeOrderItemRequest mallTradeOrderItem) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeOrderItem);
    }

    Future<ApiResponse<void>> deleteMallTradeOrderItem(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeOrderItemResponse>> getMallTradeOrderItem(int id) async {
        return await _httpClient.get<MallTradeOrderItemResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeOrderItemResponse>>> listMallTradeOrderItem() async {
        return await _httpClient.get<List<MallTradeOrderItemResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeOrderItemResponse>>> pageMallTradeOrderItem(MallTradeOrderItemQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeOrderItemResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}