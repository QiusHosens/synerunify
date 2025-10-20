import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_promotion_serving_conversation/create', // 新增
  'update': '/mall/mall_promotion_serving_conversation/update', // 修改
  'delete': '/mall/mall_promotion_serving_conversation/delete', // 删除
  'get': '/mall/mall_promotion_serving_conversation/get', // 单条查询
  'list': '/mall/mall_promotion_serving_conversation/list', // 列表查询
  'page': '/mall/mall_promotion_serving_conversation/page', // 分页查询
};

class MallPromotionServingConversationRequest {
  final int id; // 编号
  final int userId; // 会话所属用户
  final DateTime lastMessageTime; // 最后聊天时间
  final String lastMessageContent; // 最后聊天内容
  final int lastMessageContentType; // 最后发送的消息类型
  final bool adminPinned; // 管理端置顶
  final bool userDeleted; // 用户是否可见
  final bool adminDeleted; // 管理员是否可见
  final int adminUnreadMessageCount; // 管理员未读消息数
  

  MallPromotionServingConversationRequest({
    required this.id,
    required this.userId,
    required this.lastMessageTime,
    required this.lastMessageContent,
    required this.lastMessageContentType,
    required this.adminPinned,
    required this.userDeleted,
    required this.adminDeleted,
    required this.adminUnreadMessageCount,
    });

  factory MallPromotionServingConversationRequest.fromJson(Map<String, dynamic> json) {
    return MallPromotionServingConversationRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      lastMessageTime: json['last_message_time'] as DateTime,
      lastMessageContent: json['last_message_content'] as String,
      lastMessageContentType: json['last_message_content_type'] as int,
      adminPinned: json['admin_pinned'] as bool,
      userDeleted: json['user_deleted'] as bool,
      adminDeleted: json['admin_deleted'] as bool,
      adminUnreadMessageCount: json['admin_unread_message_count'] as int,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'last_message_time': lastMessageTime,
      'last_message_content': lastMessageContent,
      'last_message_content_type': lastMessageContentType,
      'admin_pinned': adminPinned,
      'user_deleted': userDeleted,
      'admin_deleted': adminDeleted,
      'admin_unread_message_count': adminUnreadMessageCount,
      };
  }
}

class MallPromotionServingConversationQueryCondition extends PaginatedRequest {
  MallPromotionServingConversationQueryCondition({
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

class MallPromotionServingConversationResponse {
  final int id; // 编号
  final int userId; // 会话所属用户
  final DateTime lastMessageTime; // 最后聊天时间
  final String lastMessageContent; // 最后聊天内容
  final int lastMessageContentType; // 最后发送的消息类型
  final bool adminPinned; // 管理端置顶
  final bool userDeleted; // 用户是否可见
  final bool adminDeleted; // 管理员是否可见
  final int adminUnreadMessageCount; // 管理员未读消息数
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallPromotionServingConversationResponse({
    required this.id,
    required this.userId,
    required this.lastMessageTime,
    required this.lastMessageContent,
    required this.lastMessageContentType,
    required this.adminPinned,
    required this.userDeleted,
    required this.adminDeleted,
    required this.adminUnreadMessageCount,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallPromotionServingConversationResponse.fromJson(Map<String, dynamic> json) {
    return MallPromotionServingConversationResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      lastMessageTime: json['last_message_time'] as DateTime,
      lastMessageContent: json['last_message_content'] as String,
      lastMessageContentType: json['last_message_content_type'] as int,
      adminPinned: json['admin_pinned'] as bool,
      userDeleted: json['user_deleted'] as bool,
      adminDeleted: json['admin_deleted'] as bool,
      adminUnreadMessageCount: json['admin_unread_message_count'] as int,
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
      'last_message_time': lastMessageTime,
      'last_message_content': lastMessageContent,
      'last_message_content_type': lastMessageContentType,
      'admin_pinned': adminPinned,
      'user_deleted': userDeleted,
      'admin_deleted': adminDeleted,
      'admin_unread_message_count': adminUnreadMessageCount,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallPromotionServingConversationService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallPromotionServingConversation(MallPromotionServingConversationRequest mallPromotionServingConversation) async {
        return await _httpClient.post<int>(apis['create']!, data: mallPromotionServingConversation);
    }

    Future<ApiResponse<int>> updateMallPromotionServingConversation(MallPromotionServingConversationRequest mallPromotionServingConversation) async {
        return await _httpClient.post<int>(apis['update']!, data: mallPromotionServingConversation);
    }

    Future<ApiResponse<void>> deleteMallPromotionServingConversation(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallPromotionServingConversationResponse>> getMallPromotionServingConversation(int id) async {
        return await _httpClient.get<MallPromotionServingConversationResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallPromotionServingConversationResponse>>> listMallPromotionServingConversation() async {
        return await _httpClient.get<List<MallPromotionServingConversationResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallPromotionServingConversationResponse>>> pageMallPromotionServingConversation(MallPromotionServingConversationQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallPromotionServingConversationResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}