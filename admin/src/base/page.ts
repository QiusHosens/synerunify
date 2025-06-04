export interface PaginatedRequest {
  page: number;
  size: number;
  keyword?: string; // 关键字
  sort_field?: string; // 排序字段
  sort?: string; // 排序,asc or desc
  filter_field?: string; // 过滤字段
  filter_operator?: string; // 过滤操作
  filter_value?: string; // 过滤值
}

export interface PaginatedResponse<T> {
  list: Array<T>;
  total_pages: number;
  page: number;
  size: number;
  total: number;
}