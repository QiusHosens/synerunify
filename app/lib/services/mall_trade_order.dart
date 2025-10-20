import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_order/create', // 新增
  'update': '/mall/mall_trade_order/update', // 修改
  'delete': '/mall/mall_trade_order/delete', // 删除
  'get': '/mall/mall_trade_order/get', // 单条查询
  'list': '/mall/mall_trade_order/list', // 列表查询
  'page': '/mall/mall_trade_order/page', // 分页查询
  'enable': '/mall/mall_trade_order/enable', // 启用
  'disable': '/mall/mall_trade_order/disable', // 禁用
};

class MallTradeOrderRequest {
  final int id; // 订单编号
  final String no; // 订单流水号
  final int type; // 订单类型
  final int terminal; // 订单来源终端
  final int userId; // 用户编号
  final String userIp; // 用户 IP
  final String? userRemark; // 用户备注
  final int status; // 订单状态
  final int productCount; // 购买的商品数量
  final int? cancelType; // 取消类型
  final String? remark; // 商家备注
  final bool commentStatus; // 是否评价
  final int? brokerageUserId; // 推广人编号
  final int? payOrderId; // 支付订单编号
  final bool payStatus; // 是否已支付：[0:未支付 1:已经支付过]
  final DateTime? payTime; // 订单支付时间
  final String? payChannelCode; // 支付成功的支付渠道
  final DateTime? finishTime; // 订单完成时间
  final DateTime? cancelTime; // 订单取消时间
  final int totalPrice; // 商品原价（总），单位：分
  final int discountPrice; // 订单优惠（总），单位：分
  final int deliveryPrice; // 运费金额，单位：分
  final int adjustPrice; // 订单调价（总），单位：分
  final int payPrice; // 应付金额（总），单位：分
  final int deliveryType; // 配送类型
  final int? logisticsId; // 发货物流公司编号
  final String? logisticsNo; // 物流公司单号
  final DateTime? deliveryTime; // 发货时间
  final DateTime? receiveTime; // 收货时间
  final String receiverName; // 收件人名称
  final String receiverMobile; // 收件人手机
  final int? receiverAreaId; // 收件人地区编号
  final String? receiverDetailAddress; // 收件人详细地址
  final int? pickUpStoreId; // 自提门店编号
  final String? pickUpVerifyCode; // 自提核销码
  final int refundStatus; // 售后状态
  final int refundPrice; // 退款金额，单位：分
  final int? couponId; // 优惠劵编号
  final int couponPrice; // 优惠劵减免金额，单位：分
  final int usePoint; // 使用的积分
  final int pointPrice; // 积分抵扣的金额
  final int givePoint; // 赠送的积分
  final int refundPoint; // 退还的使用的积分
  final int vipPrice; // VIP 减免金额，单位：分
  final String? giveCouponTemplateCounts; // 赠送的优惠劵
  final String? giveCouponIds; // 赠送的优惠劵编号
  final int? flashActivityId; // 秒杀活动编号
  final int? bargainActivityId; // 砍价活动编号
  final int? bargainRecordId; // 砍价记录编号
  final int? combinationActivityId; // 拼团活动编号
  final int? combinationHeadId; // 拼团团长编号
  final int? combinationRecordId; // 拼团记录编号
  final int? pointActivityId; // 积分活动编号
  

  MallTradeOrderRequest({
    required this.id,
    required this.no,
    required this.type,
    required this.terminal,
    required this.userId,
    required this.userIp,
    this.userRemark,
    required this.status,
    required this.productCount,
    this.cancelType,
    this.remark,
    required this.commentStatus,
    this.brokerageUserId,
    this.payOrderId,
    required this.payStatus,
    this.payTime,
    this.payChannelCode,
    this.finishTime,
    this.cancelTime,
    required this.totalPrice,
    required this.discountPrice,
    required this.deliveryPrice,
    required this.adjustPrice,
    required this.payPrice,
    required this.deliveryType,
    this.logisticsId,
    this.logisticsNo,
    this.deliveryTime,
    this.receiveTime,
    required this.receiverName,
    required this.receiverMobile,
    this.receiverAreaId,
    this.receiverDetailAddress,
    this.pickUpStoreId,
    this.pickUpVerifyCode,
    required this.refundStatus,
    required this.refundPrice,
    this.couponId,
    required this.couponPrice,
    required this.usePoint,
    required this.pointPrice,
    required this.givePoint,
    required this.refundPoint,
    required this.vipPrice,
    this.giveCouponTemplateCounts,
    this.giveCouponIds,
    this.flashActivityId,
    this.bargainActivityId,
    this.bargainRecordId,
    this.combinationActivityId,
    this.combinationHeadId,
    this.combinationRecordId,
    this.pointActivityId,
    });

  factory MallTradeOrderRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeOrderRequest(
      id: json['id'] as int,
      no: json['no'] as String,
      type: json['type'] as int,
      terminal: json['terminal'] as int,
      userId: json['user_id'] as int,
      userIp: json['user_ip'] as String,
      userRemark: json['user_remark'] as String?,
      status: json['status'] as int,
      productCount: json['product_count'] as int,
      cancelType: json['cancel_type'] as int?,
      remark: json['remark'] as String?,
      commentStatus: json['comment_status'] as bool,
      brokerageUserId: json['brokerage_user_id'] as int?,
      payOrderId: json['pay_order_id'] as int?,
      payStatus: json['pay_status'] as bool,
      payTime: json['pay_time'] as DateTime?,
      payChannelCode: json['pay_channel_code'] as String?,
      finishTime: json['finish_time'] as DateTime?,
      cancelTime: json['cancel_time'] as DateTime?,
      totalPrice: json['total_price'] as int,
      discountPrice: json['discount_price'] as int,
      deliveryPrice: json['delivery_price'] as int,
      adjustPrice: json['adjust_price'] as int,
      payPrice: json['pay_price'] as int,
      deliveryType: json['delivery_type'] as int,
      logisticsId: json['logistics_id'] as int?,
      logisticsNo: json['logistics_no'] as String?,
      deliveryTime: json['delivery_time'] as DateTime?,
      receiveTime: json['receive_time'] as DateTime?,
      receiverName: json['receiver_name'] as String,
      receiverMobile: json['receiver_mobile'] as String,
      receiverAreaId: json['receiver_area_id'] as int?,
      receiverDetailAddress: json['receiver_detail_address'] as String?,
      pickUpStoreId: json['pick_up_store_id'] as int?,
      pickUpVerifyCode: json['pick_up_verify_code'] as String?,
      refundStatus: json['refund_status'] as int,
      refundPrice: json['refund_price'] as int,
      couponId: json['coupon_id'] as int?,
      couponPrice: json['coupon_price'] as int,
      usePoint: json['use_point'] as int,
      pointPrice: json['point_price'] as int,
      givePoint: json['give_point'] as int,
      refundPoint: json['refund_point'] as int,
      vipPrice: json['vip_price'] as int,
      giveCouponTemplateCounts: json['give_coupon_template_counts'] as String?,
      giveCouponIds: json['give_coupon_ids'] as String?,
      flashActivityId: json['flash_activity_id'] as int?,
      bargainActivityId: json['bargain_activity_id'] as int?,
      bargainRecordId: json['bargain_record_id'] as int?,
      combinationActivityId: json['combination_activity_id'] as int?,
      combinationHeadId: json['combination_head_id'] as int?,
      combinationRecordId: json['combination_record_id'] as int?,
      pointActivityId: json['point_activity_id'] as int?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'no': no,
      'type': type,
      'terminal': terminal,
      'user_id': userId,
      'user_ip': userIp,
      'user_remark': userRemark,
      'status': status,
      'product_count': productCount,
      'cancel_type': cancelType,
      'remark': remark,
      'comment_status': commentStatus,
      'brokerage_user_id': brokerageUserId,
      'pay_order_id': payOrderId,
      'pay_status': payStatus,
      'pay_time': payTime,
      'pay_channel_code': payChannelCode,
      'finish_time': finishTime,
      'cancel_time': cancelTime,
      'total_price': totalPrice,
      'discount_price': discountPrice,
      'delivery_price': deliveryPrice,
      'adjust_price': adjustPrice,
      'pay_price': payPrice,
      'delivery_type': deliveryType,
      'logistics_id': logisticsId,
      'logistics_no': logisticsNo,
      'delivery_time': deliveryTime,
      'receive_time': receiveTime,
      'receiver_name': receiverName,
      'receiver_mobile': receiverMobile,
      'receiver_area_id': receiverAreaId,
      'receiver_detail_address': receiverDetailAddress,
      'pick_up_store_id': pickUpStoreId,
      'pick_up_verify_code': pickUpVerifyCode,
      'refund_status': refundStatus,
      'refund_price': refundPrice,
      'coupon_id': couponId,
      'coupon_price': couponPrice,
      'use_point': usePoint,
      'point_price': pointPrice,
      'give_point': givePoint,
      'refund_point': refundPoint,
      'vip_price': vipPrice,
      'give_coupon_template_counts': giveCouponTemplateCounts,
      'give_coupon_ids': giveCouponIds,
      'flash_activity_id': flashActivityId,
      'bargain_activity_id': bargainActivityId,
      'bargain_record_id': bargainRecordId,
      'combination_activity_id': combinationActivityId,
      'combination_head_id': combinationHeadId,
      'combination_record_id': combinationRecordId,
      'point_activity_id': pointActivityId,
      };
  }
}

class MallTradeOrderQueryCondition extends PaginatedRequest {
  MallTradeOrderQueryCondition({
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

class MallTradeOrderResponse {
  final int id; // 订单编号
  final String no; // 订单流水号
  final int type; // 订单类型
  final int terminal; // 订单来源终端
  final int userId; // 用户编号
  final String userIp; // 用户 IP
  final String? userRemark; // 用户备注
  final int status; // 订单状态
  final int productCount; // 购买的商品数量
  final int? cancelType; // 取消类型
  final String? remark; // 商家备注
  final bool commentStatus; // 是否评价
  final int? brokerageUserId; // 推广人编号
  final int? payOrderId; // 支付订单编号
  final bool payStatus; // 是否已支付：[0:未支付 1:已经支付过]
  final DateTime? payTime; // 订单支付时间
  final String? payChannelCode; // 支付成功的支付渠道
  final DateTime? finishTime; // 订单完成时间
  final DateTime? cancelTime; // 订单取消时间
  final int totalPrice; // 商品原价（总），单位：分
  final int discountPrice; // 订单优惠（总），单位：分
  final int deliveryPrice; // 运费金额，单位：分
  final int adjustPrice; // 订单调价（总），单位：分
  final int payPrice; // 应付金额（总），单位：分
  final int deliveryType; // 配送类型
  final int? logisticsId; // 发货物流公司编号
  final String? logisticsNo; // 物流公司单号
  final DateTime? deliveryTime; // 发货时间
  final DateTime? receiveTime; // 收货时间
  final String receiverName; // 收件人名称
  final String receiverMobile; // 收件人手机
  final int? receiverAreaId; // 收件人地区编号
  final String? receiverDetailAddress; // 收件人详细地址
  final int? pickUpStoreId; // 自提门店编号
  final String? pickUpVerifyCode; // 自提核销码
  final int refundStatus; // 售后状态
  final int refundPrice; // 退款金额，单位：分
  final int? couponId; // 优惠劵编号
  final int couponPrice; // 优惠劵减免金额，单位：分
  final int usePoint; // 使用的积分
  final int pointPrice; // 积分抵扣的金额
  final int givePoint; // 赠送的积分
  final int refundPoint; // 退还的使用的积分
  final int vipPrice; // VIP 减免金额，单位：分
  final String? giveCouponTemplateCounts; // 赠送的优惠劵
  final String? giveCouponIds; // 赠送的优惠劵编号
  final int? flashActivityId; // 秒杀活动编号
  final int? bargainActivityId; // 砍价活动编号
  final int? bargainRecordId; // 砍价记录编号
  final int? combinationActivityId; // 拼团活动编号
  final int? combinationHeadId; // 拼团团长编号
  final int? combinationRecordId; // 拼团记录编号
  final int? pointActivityId; // 积分活动编号
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeOrderResponse({
    required this.id,
    required this.no,
    required this.type,
    required this.terminal,
    required this.userId,
    required this.userIp,
    this.userRemark,
    required this.status,
    required this.productCount,
    this.cancelType,
    this.remark,
    required this.commentStatus,
    this.brokerageUserId,
    this.payOrderId,
    required this.payStatus,
    this.payTime,
    this.payChannelCode,
    this.finishTime,
    this.cancelTime,
    required this.totalPrice,
    required this.discountPrice,
    required this.deliveryPrice,
    required this.adjustPrice,
    required this.payPrice,
    required this.deliveryType,
    this.logisticsId,
    this.logisticsNo,
    this.deliveryTime,
    this.receiveTime,
    required this.receiverName,
    required this.receiverMobile,
    this.receiverAreaId,
    this.receiverDetailAddress,
    this.pickUpStoreId,
    this.pickUpVerifyCode,
    required this.refundStatus,
    required this.refundPrice,
    this.couponId,
    required this.couponPrice,
    required this.usePoint,
    required this.pointPrice,
    required this.givePoint,
    required this.refundPoint,
    required this.vipPrice,
    this.giveCouponTemplateCounts,
    this.giveCouponIds,
    this.flashActivityId,
    this.bargainActivityId,
    this.bargainRecordId,
    this.combinationActivityId,
    this.combinationHeadId,
    this.combinationRecordId,
    this.pointActivityId,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeOrderResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeOrderResponse(
      id: json['id'] as int,
      no: json['no'] as String,
      type: json['type'] as int,
      terminal: json['terminal'] as int,
      userId: json['user_id'] as int,
      userIp: json['user_ip'] as String,
      userRemark: json['user_remark'] as String?,
      status: json['status'] as int,
      productCount: json['product_count'] as int,
      cancelType: json['cancel_type'] as int?,
      remark: json['remark'] as String?,
      commentStatus: json['comment_status'] as bool,
      brokerageUserId: json['brokerage_user_id'] as int?,
      payOrderId: json['pay_order_id'] as int?,
      payStatus: json['pay_status'] as bool,
      payTime: json['pay_time'] as DateTime?,
      payChannelCode: json['pay_channel_code'] as String?,
      finishTime: json['finish_time'] as DateTime?,
      cancelTime: json['cancel_time'] as DateTime?,
      totalPrice: json['total_price'] as int,
      discountPrice: json['discount_price'] as int,
      deliveryPrice: json['delivery_price'] as int,
      adjustPrice: json['adjust_price'] as int,
      payPrice: json['pay_price'] as int,
      deliveryType: json['delivery_type'] as int,
      logisticsId: json['logistics_id'] as int?,
      logisticsNo: json['logistics_no'] as String?,
      deliveryTime: json['delivery_time'] as DateTime?,
      receiveTime: json['receive_time'] as DateTime?,
      receiverName: json['receiver_name'] as String,
      receiverMobile: json['receiver_mobile'] as String,
      receiverAreaId: json['receiver_area_id'] as int?,
      receiverDetailAddress: json['receiver_detail_address'] as String?,
      pickUpStoreId: json['pick_up_store_id'] as int?,
      pickUpVerifyCode: json['pick_up_verify_code'] as String?,
      refundStatus: json['refund_status'] as int,
      refundPrice: json['refund_price'] as int,
      couponId: json['coupon_id'] as int?,
      couponPrice: json['coupon_price'] as int,
      usePoint: json['use_point'] as int,
      pointPrice: json['point_price'] as int,
      givePoint: json['give_point'] as int,
      refundPoint: json['refund_point'] as int,
      vipPrice: json['vip_price'] as int,
      giveCouponTemplateCounts: json['give_coupon_template_counts'] as String?,
      giveCouponIds: json['give_coupon_ids'] as String?,
      flashActivityId: json['flash_activity_id'] as int?,
      bargainActivityId: json['bargain_activity_id'] as int?,
      bargainRecordId: json['bargain_record_id'] as int?,
      combinationActivityId: json['combination_activity_id'] as int?,
      combinationHeadId: json['combination_head_id'] as int?,
      combinationRecordId: json['combination_record_id'] as int?,
      pointActivityId: json['point_activity_id'] as int?,
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
      'terminal': terminal,
      'user_id': userId,
      'user_ip': userIp,
      'user_remark': userRemark,
      'status': status,
      'product_count': productCount,
      'cancel_type': cancelType,
      'remark': remark,
      'comment_status': commentStatus,
      'brokerage_user_id': brokerageUserId,
      'pay_order_id': payOrderId,
      'pay_status': payStatus,
      'pay_time': payTime,
      'pay_channel_code': payChannelCode,
      'finish_time': finishTime,
      'cancel_time': cancelTime,
      'total_price': totalPrice,
      'discount_price': discountPrice,
      'delivery_price': deliveryPrice,
      'adjust_price': adjustPrice,
      'pay_price': payPrice,
      'delivery_type': deliveryType,
      'logistics_id': logisticsId,
      'logistics_no': logisticsNo,
      'delivery_time': deliveryTime,
      'receive_time': receiveTime,
      'receiver_name': receiverName,
      'receiver_mobile': receiverMobile,
      'receiver_area_id': receiverAreaId,
      'receiver_detail_address': receiverDetailAddress,
      'pick_up_store_id': pickUpStoreId,
      'pick_up_verify_code': pickUpVerifyCode,
      'refund_status': refundStatus,
      'refund_price': refundPrice,
      'coupon_id': couponId,
      'coupon_price': couponPrice,
      'use_point': usePoint,
      'point_price': pointPrice,
      'give_point': givePoint,
      'refund_point': refundPoint,
      'vip_price': vipPrice,
      'give_coupon_template_counts': giveCouponTemplateCounts,
      'give_coupon_ids': giveCouponIds,
      'flash_activity_id': flashActivityId,
      'bargain_activity_id': bargainActivityId,
      'bargain_record_id': bargainRecordId,
      'combination_activity_id': combinationActivityId,
      'combination_head_id': combinationHeadId,
      'combination_record_id': combinationRecordId,
      'point_activity_id': pointActivityId,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeOrderService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeOrder(MallTradeOrderRequest mallTradeOrder) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeOrder);
    }

    Future<ApiResponse<int>> updateMallTradeOrder(MallTradeOrderRequest mallTradeOrder) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeOrder);
    }

    Future<ApiResponse<void>> deleteMallTradeOrder(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeOrderResponse>> getMallTradeOrder(int id) async {
        return await _httpClient.get<MallTradeOrderResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeOrderResponse>>> listMallTradeOrder() async {
        return await _httpClient.get<List<MallTradeOrderResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeOrderResponse>>> pageMallTradeOrder(MallTradeOrderQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeOrderResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallTradeOrder(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallTradeOrder(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}