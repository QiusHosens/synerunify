import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_product_comment/create', // 新增
  'update': '/mall/mall_product_comment/update', // 修改
  'delete': '/mall/mall_product_comment/delete', // 删除
  'get': '/mall/mall_product_comment/get', // 单条查询
  'list': '/mall/mall_product_comment/list', // 列表查询
  'page': '/mall/mall_product_comment/page', // 分页查询
};

class MallProductCommentRequest {
  final int id; // 评论编号，主键自增
  final int userId; // 评价人的用户编号，关联 MemberUserDO 的 id 编号
  final String? userNickname; // 评价人名称
  final String? userAvatar; // 评价人头像
  final bool anonymous; // 是否匿名
  final int? orderId; // 交易订单编号，关联 TradeOrderDO 的 id 编号
  final int? orderItemId; // 交易订单项编号，关联 TradeOrderItemDO 的 id 编号
  final int spuId; // 商品 SPU 编号，关联 ProductSpuDO 的 id
  final String? spuName; // 商品 SPU 名称
  final int skuId; // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
  final int fileId; // 图片ID
  final String? skuProperties; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  final bool? visible; // 是否可见，true:显示false:隐藏
  final int scores; // 评分星级1-5分
  final int descriptionScores; // 描述星级 1-5 星
  final int benefitScores; // 服务星级 1-5 星
  final String content; // 评论内容
  final String? fileIds; // 评论图片id数组
  final bool? replyStatus; // 商家是否回复
  final int? replyUserId; // 回复管理员编号，关联 AdminUserDO 的 id 编号
  final String? replyContent; // 商家回复内容
  final DateTime? replyTime; // 商家回复时间
  

  MallProductCommentRequest({
    required this.id,
    required this.userId,
    this.userNickname,
    this.userAvatar,
    required this.anonymous,
    this.orderId,
    this.orderItemId,
    required this.spuId,
    this.spuName,
    required this.skuId,
    required this.fileId,
    this.skuProperties,
    this.visible,
    required this.scores,
    required this.descriptionScores,
    required this.benefitScores,
    required this.content,
    this.fileIds,
    this.replyStatus,
    this.replyUserId,
    this.replyContent,
    this.replyTime,
    });

  factory MallProductCommentRequest.fromJson(Map<String, dynamic> json) {
    return MallProductCommentRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      userNickname: json['user_nickname'] as String?,
      userAvatar: json['user_avatar'] as String?,
      anonymous: json['anonymous'] as bool,
      orderId: json['order_id'] as int?,
      orderItemId: json['order_item_id'] as int?,
      spuId: json['spu_id'] as int,
      spuName: json['spu_name'] as String?,
      skuId: json['sku_id'] as int,
      fileId: json['file_id'] as int,
      skuProperties: json['sku_properties'] as String?,
      visible: json['visible'] as bool?,
      scores: json['scores'] as int,
      descriptionScores: json['description_scores'] as int,
      benefitScores: json['benefit_scores'] as int,
      content: json['content'] as String,
      fileIds: json['file_ids'] as String?,
      replyStatus: json['reply_status'] as bool?,
      replyUserId: json['reply_user_id'] as int?,
      replyContent: json['reply_content'] as String?,
      replyTime: json['reply_time'] as DateTime?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'user_nickname': userNickname,
      'user_avatar': userAvatar,
      'anonymous': anonymous,
      'order_id': orderId,
      'order_item_id': orderItemId,
      'spu_id': spuId,
      'spu_name': spuName,
      'sku_id': skuId,
      'file_id': fileId,
      'sku_properties': skuProperties,
      'visible': visible,
      'scores': scores,
      'description_scores': descriptionScores,
      'benefit_scores': benefitScores,
      'content': content,
      'file_ids': fileIds,
      'reply_status': replyStatus,
      'reply_user_id': replyUserId,
      'reply_content': replyContent,
      'reply_time': replyTime,
      };
  }
}

class MallProductCommentQueryCondition extends PaginatedRequest {
  MallProductCommentQueryCondition({
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

class MallProductCommentResponse {
  final int id; // 评论编号，主键自增
  final int userId; // 评价人的用户编号，关联 MemberUserDO 的 id 编号
  final String? userNickname; // 评价人名称
  final String? userAvatar; // 评价人头像
  final bool anonymous; // 是否匿名
  final int? orderId; // 交易订单编号，关联 TradeOrderDO 的 id 编号
  final int? orderItemId; // 交易订单项编号，关联 TradeOrderItemDO 的 id 编号
  final int spuId; // 商品 SPU 编号，关联 ProductSpuDO 的 id
  final String? spuName; // 商品 SPU 名称
  final int skuId; // 商品 SKU 编号，关联 ProductSkuDO 的 id 编号
  final int fileId; // 图片ID
  final String? skuProperties; // 属性数组，JSON 格式 [{propertId: , valueId: }, {propertId: , valueId: }]
  final bool? visible; // 是否可见，true:显示false:隐藏
  final int scores; // 评分星级1-5分
  final int descriptionScores; // 描述星级 1-5 星
  final int benefitScores; // 服务星级 1-5 星
  final String content; // 评论内容
  final String? fileIds; // 评论图片id数组
  final bool? replyStatus; // 商家是否回复
  final int? replyUserId; // 回复管理员编号，关联 AdminUserDO 的 id 编号
  final String? replyContent; // 商家回复内容
  final DateTime? replyTime; // 商家回复时间
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallProductCommentResponse({
    required this.id,
    required this.userId,
    this.userNickname,
    this.userAvatar,
    required this.anonymous,
    this.orderId,
    this.orderItemId,
    required this.spuId,
    this.spuName,
    required this.skuId,
    required this.fileId,
    this.skuProperties,
    this.visible,
    required this.scores,
    required this.descriptionScores,
    required this.benefitScores,
    required this.content,
    this.fileIds,
    this.replyStatus,
    this.replyUserId,
    this.replyContent,
    this.replyTime,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallProductCommentResponse.fromJson(Map<String, dynamic> json) {
    return MallProductCommentResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      userNickname: json['user_nickname'] as String?,
      userAvatar: json['user_avatar'] as String?,
      anonymous: json['anonymous'] as bool,
      orderId: json['order_id'] as int?,
      orderItemId: json['order_item_id'] as int?,
      spuId: json['spu_id'] as int,
      spuName: json['spu_name'] as String?,
      skuId: json['sku_id'] as int,
      fileId: json['file_id'] as int,
      skuProperties: json['sku_properties'] as String?,
      visible: json['visible'] as bool?,
      scores: json['scores'] as int,
      descriptionScores: json['description_scores'] as int,
      benefitScores: json['benefit_scores'] as int,
      content: json['content'] as String,
      fileIds: json['file_ids'] as String?,
      replyStatus: json['reply_status'] as bool?,
      replyUserId: json['reply_user_id'] as int?,
      replyContent: json['reply_content'] as String?,
      replyTime: json['reply_time'] as DateTime?,
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
      'user_nickname': userNickname,
      'user_avatar': userAvatar,
      'anonymous': anonymous,
      'order_id': orderId,
      'order_item_id': orderItemId,
      'spu_id': spuId,
      'spu_name': spuName,
      'sku_id': skuId,
      'file_id': fileId,
      'sku_properties': skuProperties,
      'visible': visible,
      'scores': scores,
      'description_scores': descriptionScores,
      'benefit_scores': benefitScores,
      'content': content,
      'file_ids': fileIds,
      'reply_status': replyStatus,
      'reply_user_id': replyUserId,
      'reply_content': replyContent,
      'reply_time': replyTime,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallProductCommentService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallProductComment(MallProductCommentRequest mallProductComment) async {
        return await _httpClient.post<int>(apis['create']!, data: mallProductComment);
    }

    Future<ApiResponse<int>> updateMallProductComment(MallProductCommentRequest mallProductComment) async {
        return await _httpClient.post<int>(apis['update']!, data: mallProductComment);
    }

    Future<ApiResponse<void>> deleteMallProductComment(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallProductCommentResponse>> getMallProductComment(int id) async {
        return await _httpClient.get<MallProductCommentResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallProductCommentResponse>>> listMallProductComment() async {
        return await _httpClient.get<List<MallProductCommentResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallProductCommentResponse>>> pageMallProductComment(MallProductCommentQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallProductCommentResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}