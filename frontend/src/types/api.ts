// Types génériques pour les API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  detail?: string;
  status?: number;
}
