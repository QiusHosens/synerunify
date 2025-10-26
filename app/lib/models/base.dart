import 'package:synerunify/utils/logger.dart';

import '../utils/type_utils.dart';

class PaginatedRequest {
  final int page;
  final int size;
  final String? keyword;
  final String? sortField;
  final String? sort;
  final String? filterField;
  final String? filterOperator;
  final String? filterValue;

  PaginatedRequest({
    required this.page,
    required this.size,
    this.keyword,
    this.sortField,
    this.sort,
    this.filterField,
    this.filterOperator,
    this.filterValue,
  });

  factory PaginatedRequest.fromJson(Map<String, dynamic> json) {
    return PaginatedRequest(
      page: TypeUtils.parseInt(json['page']),
      size: TypeUtils.parseInt(json['size']),
      keyword: json['keyword'] as String?,
      sortField: json['sort_field'] as String?,
      sort: json['sort'] as String?,
      filterField: json['filter_field'] as String?,
      filterOperator: json['filter_operator'] as String?,
      filterValue: json['filter_value'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'page': page,
      'size': size,
      'keyword': keyword,
      'sort_field': sortField,
      'sort': sort,
      'filter_field': filterField,
      'filter_operator': filterOperator,
      'filter_value': filterValue,
    };
  }
}

class PaginatedResponse<T> {
  final List<T> list;
  final int totalPages;
  final int page;
  final int size;
  final int total;

  PaginatedResponse({
    required this.list,
    required this.totalPages,
    required this.page,
    required this.size,
    required this.total,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJson,
  ) {
    // Logger.info('page list: ${json['list']}');
    List<T> list = [];
    if (fromJson != null) {
      for (var item in json['list']) {
        // Logger.info('item: ${item}');
        list.add(fromJson(item));
      }
    }
    return PaginatedResponse(
      list: fromJson != null ? list : json['list'] as List<T>,
      totalPages: TypeUtils.parseInt(json['total_pages']),
      page: TypeUtils.parseInt(json['page']),
      size: TypeUtils.parseInt(json['size']),
      total: TypeUtils.parseInt(json['total']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'list': list,
      'total_pages': totalPages,
      'page': page,
      'size': size,
      'total': total,
    };
  }
}
