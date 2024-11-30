// Define an interface for pagination options
export interface PaginationOptions {
  page: number; // Current page number
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
