/**
 * Base pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * User creation request
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  country?: string;
}

/**
 * User update request
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  country?: string;
}

/**
 * Group creation request
 */
export interface CreateGroupRequest {
  name: string;
  typeid: number;
  localid?: string;
}

/**
 * Group update request
 */
export interface UpdateGroupRequest {
  name?: string;
  typeid?: number;
  localid?: string;
}

/**
 * User group assignment request
 */
export interface AssignUserGroupRequest {
  userid: string;
  groupid: string;
}
