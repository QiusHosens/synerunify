export interface PaginatedRequest {
  page: number;
  size: number;
  keyword?: string; // 关键字
  field?: string; // 排序字段
  sort?: string; // 排序,asc or desc
}

export interface PaginatedResponse<T> {
  list: Array<T>;
  total_pages: number;
  page: number;
  size: number;
  total: number;
}