import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_serving_message/create', // 新增
  'update': '/mall/mall_promotion_serving_message/update', // 修改
  'delete': '/mall/mall_promotion_serving_message/delete', // 删除
  'get': '/mall/mall_promotion_serving_message/get', // 单条查询
  'list': '/mall/mall_promotion_serving_message/list', // 列表查询
  'page': '/mall/mall_promotion_serving_message/page', // 分页查询
};

class MallPromotionServingMessageRequest {
  final int id; // 编号
  final int conversationId; // 会话编号
  final int senderId; // 发送人编号
  final int senderType; // 发送人类型
  final int? receiverId; // 接收人编号
  final int? receiverType; // 接收人类型
  final int contentType; // 消息类型
  final String content; // 消息
  final bool readStatus; // 是否已读
  

  MallPromotionServingMessageRequest({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderType,
    this.receiverId,
    this.receiverType,
    required this.contentType,
    required this.content,
    required this.readStatus,
    });

  factory MallPromotionServingMessageRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionServingMessageRequest(
      id: json['id'] as int,
      conversationId: json['conversation_id'] as int,
      senderId: json['sender_id'] as int,
      senderType: json['sender_type'] as int,
      receiverId: json['receiver_id'] as int?,
      receiverType: json['receiver_type'] as int?,
      contentType: json['content_type'] as int,
      content: json['content'] as String,
      readStatus: json['read_status'] as bool,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'conversation_id': conversationId,
      'sender_id': senderId,
      'sender_type': senderType,
      'receiver_id': receiverId,
      'receiver_type': receiverType,
      'content_type': contentType,
      'content': content,
      'read_status': readStatus,
      };
  }
}

class MallPromotionServingMessageQueryCondition extends PaginatedRequest {
  MallPromotionServingMessageQueryCondition({
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

class MallPromotionServingMessageResponse {
  final int id; // 编号
  final int conversationId; // 会话编号
  final int senderId; // 发送人编号
  final int senderType; // 发送人类型
  final int? receiverId; // 接收人编号
  final int? receiverType; // 接收人类型
  final int contentType; // 消息类型
  final String content; // 消息
  final bool readStatus; // 是否已读
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionServingMessageResponse({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.senderType,
    this.receiverId,
    this.receiverType,
    required this.contentType,
    required this.content,
    required this.readStatus,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionServingMessageResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionServingMessageResponse(
      id: json['id'] as int,
      conversationId: json['conversation_id'] as int,
      senderId: json['sender_id'] as int,
      senderType: json['sender_type'] as int,
      receiverId: json['receiver_id'] as int?,
      receiverType: json['receiver_type'] as int?,
      contentType: json['content_type'] as int,
      content: json['content'] as String,
      readStatus: json['read_status'] as bool,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as DateTime,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as DateTime,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'conversation_id': conversationId,
      'sender_id': senderId,
      'sender_type': senderType,
      'receiver_id': receiverId,
      'receiver_type': receiverType,
      'content_type': contentType,
      'content': content,
      'read_status': readStatus,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionServingMessageService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionServingMessage(MallPromotionServingMessageRequest mallPromotionServingMessage) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionServingMessage);
    }

    Future<ApiResponse<int>> updateMallPromotionServingMessage(MallPromotionServingMessageRequest mallPromotionServingMessage) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionServingMessage);
    }

    Future<ApiResponse<void>> deleteMallPromotionServingMessage(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionServingMessageResponse>> getMallPromotionServingMessage(int id) async {
        return await _httpClient.get<MallPromotionServingMessageResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionServingMessageResponse>>> listMallPromotionServingMessage() async {
        return await _httpClient.get<List<MallPromotionServingMessageResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionServingMessageResponse>>> pageMallPromotionServingMessage(MallPromotionServingMessageQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionServingMessageResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}