import { User } from '../user';
import { Group } from '../group';
import { Permission } from '../permission';

/**
 * Base API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * User response with groups
 */
export interface UserWithGroupsResponse extends User {
  groups: Group[];
}

/**
 * Group response with permissions
 */
export interface GroupWithPermissionsResponse extends Group {
  permissions: Permission[];
}

/**
 * Error response
 */
export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
