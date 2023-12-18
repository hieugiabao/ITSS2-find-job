export type PageOption = {
  page: number;
  size: number;
};

export type PageResult<T> = {
  results: T[];
  totalPages: number;
  totalCount: number;
  page: number;
  size: number;
};

export type ApiResponse<T> = {
  data?: T;
  success: boolean;
};
