export interface PaginatedRequest {
  page: number;
  size: number;
  keyword?: string;
}

export interface PaginatedResponse<T> {
  list: Array<T>;
  total_pages: number;
  page: number;
  size: number;
  total: number;
}