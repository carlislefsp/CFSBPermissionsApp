/**
 * API Error Codes
 */
export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * API Error Details
 */
export interface ApiErrorDetail {
  code: ApiErrorCode;
  message: string;
  field?: string;
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status: number,
    public details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Creates an unauthorized error
   */
  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(ApiErrorCode.UNAUTHORIZED, message, 401);
  }

  /**
   * Creates a forbidden error
   */
  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(ApiErrorCode.FORBIDDEN, message, 403);
  }

  /**
   * Creates a not found error
   */
  static notFound(message = 'Not Found'): ApiError {
    return new ApiError(ApiErrorCode.NOT_FOUND, message, 404);
  }

  /**
   * Creates a conflict error
   */
  static conflict(message = 'Conflict'): ApiError {
    return new ApiError(ApiErrorCode.CONFLICT, message, 409);
  }
}
