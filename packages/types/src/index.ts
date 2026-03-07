export type UserRole = "BRAND" | "AGENCY" | "FREELANCER" | "ADMIN";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ApiResponse<T> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; details?: unknown };

export * from './content';
export * from './seo';
export * from './social';
export * from './web-builder';
