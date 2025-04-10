export interface PaginatedRequest {
  page: number;
  size: number;
  keyword: string | undefined;
}

export interface PaginatedResponse<T> {
  list: Array<T>;
  total_pages: number;
  page: number;
  size: number;
  total: number;
}