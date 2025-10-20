import 'package:synerunify/models/base.dart';

import '../utils/http_client.dart';
import '../utils/type_utils.dart';

const apis = {
  'create': '/mall/mall_trade_cart/create', // 新增
  'update': '/mall/mall_trade_cart/update', // 修改
  'delete': '/mall/mall_trade_cart/delete', // 删除
  'get': '/mall/mall_trade_cart/get', // 单条查询
  'list': '/mall/mall_trade_cart/list', // 列表查询
  'page': '/mall/mall_trade_cart/page', // 分页查询
};

class MallTradeCartRequest {
  final int id; // 编号，唯一自增。
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int count; // 商品购买数量
  final bool selected; // 是否选中
  

  MallTradeCartRequest({
    required this.id,
    required this.userId,
    required this.spuId,
    required this.skuId,
    required this.count,
    required this.selected,
    });

  factory MallTradeCartRequest.fromJson(Map<String, dynamic> json) {
    return MallTradeCartRequest(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      count: json['count'] as int,
      selected: json['selected'] as bool,
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'spu_id': spuId,
      'sku_id': skuId,
      'count': count,
      'selected': selected,
      };
  }
}

class MallTradeCartQueryCondition extends PaginatedRequest {
  MallTradeCartQueryCondition({
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

class MallTradeCartResponse {
  final int id; // 编号，唯一自增。
  final int userId; // 用户编号
  final int spuId; // 商品 SPU 编号
  final int skuId; // 商品 SKU 编号
  final int count; // 商品购买数量
  final bool selected; // 是否选中
  final int? creator; // 创建者ID
  final DateTime createTime; // 创建时间
  final int? updater; // 更新者ID
  final DateTime updateTime; // 更新时间
  MallTradeCartResponse({
    required this.id,
    required this.userId,
    required this.spuId,
    required this.skuId,
    required this.count,
    required this.selected,
    this.creator,
    required this.createTime,
    this.updater,
    required this.updateTime,
    });

  factory MallTradeCartResponse.fromJson(Map<String, dynamic> json) {
    return MallTradeCartResponse(
      id: json['id'] as int,
      userId: json['user_id'] as int,
      spuId: json['spu_id'] as int,
      skuId: json['sku_id'] as int,
      count: json['count'] as int,
      selected: json['selected'] as bool,
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
      'spu_id': spuId,
      'sku_id': skuId,
      'count': count,
      'selected': selected,
      'creator': creator,
      'create_time': createTime,
      'updater': updater,
      'update_time': updateTime,
      };
  }
}

class MallTradeCartService {

    final HttpClient _httpClient = HttpClient();

    Future<ApiResponse<int>> createMallTradeCart(MallTradeCartRequest mallTradeCart) async {
        return await _httpClient.post<int>(apis['create']!, data: mallTradeCart);
    }

    Future<ApiResponse<int>> updateMallTradeCart(MallTradeCartRequest mallTradeCart) async {
        return await _httpClient.post<int>(apis['update']!, data: mallTradeCart);
    }

    Future<ApiResponse<void>> deleteMallTradeCart(int id) async {
        return await _httpClient.post<void>('${apis['delete']!}/$id');
    }

    Future<ApiResponse<MallTradeCartResponse>> getMallTradeCart(int id) async {
        return await _httpClient.get<MallTradeCartResponse>('${apis['get']!}/$id');
    }

    Future<ApiResponse<List<MallTradeCartResponse>>> listMallTradeCart() async {
        return await _httpClient.get<List<MallTradeCartResponse>>(apis['list']!);
    }

    Future<ApiResponse<PaginatedResponse<MallTradeCartResponse>>> pageMallTradeCart(MallTradeCartQueryCondition condition) async {
        return await _httpClient.get<PaginatedResponse<MallTradeCartResponse>>(apis['page']!, queryParameters: condition.toJson());
    }
    
}