import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_store/create', // 新增
  'update': '/mall/mall_store/update', // 修改
  'delete': '/mall/mall_store/delete', // 删除
  'get': '/mall/mall_store/get', // 单条查询
  'get_without_user': '/mall/mall_store/get_without_user', // 单条查询
  'list': '/mall/mall_store/list', // 列表查询
  'page': '/mall/mall_store/page', // 分页查询
  'enable': '/mall/mall_store/enable', // 启用
  'disable': '/mall/mall_store/disable', // 禁用
};

class MallStoreRequest {
  final int id; // 店铺编号
  final String number; // 店铺编号（业务唯一，例：S202410080001）
  final String name; // 店铺名称
  final String? shortName; // 店铺简称
  final int fileId; // 店铺封面ID
  final String? sliderFileIds; // 店铺轮播图id数组，以逗号分隔最多上传15张
  final int? sort; // 店铺排序
  final String? slogan; // 店铺广告语
  final String? description; // 店铺描述
  final String? tags; // 店铺标签，逗号分隔，如：正品保障,7天无理由
  final int status; // 状态:0-待审核,1-审核通过,2-营业中,3-暂停营业,4-审核驳回,5-永久关闭
  final String? auditRemark; // 审核备注
  final String? auditTime; // 审核通过时间
  final int? scoreDesc; // 描述相符评分
  final int? scoreService; // 服务态度评分
  final int? scoreDelivery; // 发货速度评分
  final int? totalSalesAmount; // 累计销售额
  final int? totalOrderCount; // 累计订单数
  final int? totalGoodsCount; // 商品总数
  final int? totalFansCount; // 粉丝数
  final int? isRecommend; // 是否平台推荐：0-否,1-是
  

  MallStoreRequest({
    required this.id,
    required this.number,
    required this.name,
    this.shortName,
    required this.fileId,
    this.sliderFileIds,
    this.sort,
    this.slogan,
    this.description,
    this.tags,
    required this.status,
    this.auditRemark,
    this.auditTime,
    this.scoreDesc,
    this.scoreService,
    this.scoreDelivery,
    this.totalSalesAmount,
    this.totalOrderCount,
    this.totalGoodsCount,
    this.totalFansCount,
    this.isRecommend,
    });

  factory MallStoreRequest.fromJson(Map<String, dynamic> json) {
    return MallStoreRequest(
      id: json['id'] as int,
      number: json['number'] as String,
      name: json['name'] as String,
      shortName: json['short_name'] as String?,
      fileId: json['file_id'] as int,
      sliderFileIds: json['slider_file_ids'] as String?,
      sort: json['sort'] as int?,
      slogan: json['slogan'] as String?,
      description: json['description'] as String?,
      tags: json['tags'] as String?,
      status: json['status'] as int,
      auditRemark: json['audit_remark'] as String?,
      auditTime: json['audit_time'] as String?,
      scoreDesc: json['score_desc'] as int?,
      scoreService: json['score_service'] as int?,
      scoreDelivery: json['score_delivery'] as int?,
      totalSalesAmount: json['total_sales_amount'] as int?,
      totalOrderCount: json['total_order_count'] as int?,
      totalGoodsCount: json['total_goods_count'] as int?,
      totalFansCount: json['total_fans_count'] as int?,
      isRecommend: json['is_recommend'] as int?,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'number': number,
      'name': name,
      'short_name': shortName,
      'file_id': fileId,
      'slider_file_ids': sliderFileIds,
      'sort': sort,
      'slogan': slogan,
      'description': description,
      'tags': tags,
      'status': status,
      'audit_remark': auditRemark,
      'audit_time': auditTime,
      'score_desc': scoreDesc,
      'score_service': scoreService,
      'score_delivery': scoreDelivery,
      'total_sales_amount': totalSalesAmount,
      'total_order_count': totalOrderCount,
      'total_goods_count': totalGoodsCount,
      'total_fans_count': totalFansCount,
      'is_recommend': isRecommend,
      };
  }
}

class MallStoreQueryCondition extends PaginatedRequest {
  MallStoreQueryCondition({
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

class MallStoreResponse {
  final int id; // 店铺编号
  final String number; // 店铺编号（业务唯一，例：S202410080001）
  final String name; // 店铺名称
  final String? shortName; // 店铺简称
  final int fileId; // 店铺封面ID
  final String? sliderFileIds; // 店铺轮播图id数组，以逗号分隔最多上传15张
  final int? sort; // 店铺排序
  final String? slogan; // 店铺广告语
  final String? description; // 店铺描述
  final String? tags; // 店铺标签，逗号分隔，如：正品保障,7天无理由
  final int status; // 状态:0-待审核,1-审核通过,2-营业中,3-暂停营业,4-审核驳回,5-永久关闭
  final String? auditRemark; // 审核备注
  final String? auditTime; // 审核通过时间
  final int? scoreDesc; // 描述相符评分
  final int? scoreService; // 服务态度评分
  final int? scoreDelivery; // 发货速度评分
  final int? totalSalesAmount; // 累计销售额
  final int? totalOrderCount; // 累计订单数
  final int? totalGoodsCount; // 商品总数
  final int? totalFansCount; // 粉丝数
  final int? isRecommend; // 是否平台推荐：0-否,1-是
  final int? creator; // 创建者ID
  final String createTime; // 创建时间
  final int? updater; // 更新者ID
  final String updateTime; // 更新时间
  MallStoreResponse({
    required this.id,
    required this.number,
    required this.name,
    this.shortName,
    required this.fileId,
    this.sliderFileIds,
    this.sort,
    this.slogan,
    this.description,
    this.tags,
    required this.status,
    this.auditRemark,
    this.auditTime,
    this.scoreDesc,
    this.scoreService,
    this.scoreDelivery,
    this.totalSalesAmount,
    this.totalOrderCount,
    this.totalGoodsCount,
    this.totalFansCount,
    this.isRecommend,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallStoreResponse.fromJson(Map<String, dynamic> json) {
    return MallStoreResponse(
      id: json['id'] as int,
      number: json['number'] as String,
      name: json['name'] as String,
      shortName: json['short_name'] as String?,
      fileId: json['file_id'] as int,
      sliderFileIds: json['slider_file_ids'] as String?,
      sort: json['sort'] as int?,
      slogan: json['slogan'] as String?,
      description: json['description'] as String?,
      tags: json['tags'] as String?,
      status: json['status'] as int,
      auditRemark: json['audit_remark'] as String?,
      auditTime: json['audit_time'] as String?,
      scoreDesc: json['score_desc'] as int?,
      scoreService: json['score_service'] as int?,
      scoreDelivery: json['score_delivery'] as int?,
      totalSalesAmount: json['total_sales_amount'] as int?,
      totalOrderCount: json['total_order_count'] as int?,
      totalGoodsCount: json['total_goods_count'] as int?,
      totalFansCount: json['total_fans_count'] as int?,
      isRecommend: json['is_recommend'] as int?,
      creator: json['creator'] as int?,
      createTime: json['create_time'] as String,
      updater: json['updater'] as int?,
      updateTime: json['update_time'] as String,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'number': number,
      'name': name,
      'short_name': shortName,
      'file_id': fileId,
      'slider_file_ids': sliderFileIds,
      'sort': sort,
      'slogan': slogan,
      'description': description,
      'tags': tags,
      'status': status,
      'audit_remark': auditRemark,
      'audit_time': auditTime,
      'score_desc': scoreDesc,
      'score_service': scoreService,
      'score_delivery': scoreDelivery,
      'total_sales_amount': totalSalesAmount,
      'total_order_count': totalOrderCount,
      'total_goods_count': totalGoodsCount,
      'total_fans_count': totalFansCount,
      'is_recommend': isRecommend,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallStoreService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallStore(MallStoreRequest mallStore) async {
        return await _httpClient.post<int>(apis['create']!, data: mallStore);
    }

    Future<ApiResponse<int>> updateMallStore(MallStoreRequest mallStore) async {
        return await _httpClient.post<int>(apis['update']!, data: mallStore);
    }

    Future<ApiResponse<void>> deleteMallStore(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallStoreResponse>> getMallStore(int id) async {
        return await _httpClient.get<MallStoreResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<MallStoreResponse>> getMallStoreWithoutUser(int id) async {
        return await _httpClient.get<MallStoreResponse>('${apis['get_without_user']!}/$id');
    }

    Future<ApiResponse<List<MallStoreResponse>>> listMallStore() async {
        return await _httpClient.get<List<MallStoreResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallStoreResponse>>> pageMallStore(MallStoreQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallStoreResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
    Future<ApiResponse<void>> enableMallStore(int id) async {
      return await _httpClient.post<void>('${apis['enable']!}/$id');
    }

    Future<ApiResponse<void>> disableMallStore(int id) async {
      return await _httpClient.post<void>('${apis['disable']!}/$id');
    }
}