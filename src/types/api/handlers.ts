import { NextRequest } from 'next/server';

/**
 * Type for route parameters in dynamic routes
 */
export interface RouteParams {
  params: {
    [key: string]: string | string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Type for API route context
 */
export interface RouteContext<T = Record<string, string>> {
  params: T;
}

/**
 * Generic type for API route handlers
 */
export type RouteHandler<TParams = Record<string, string>> = (
  req: NextRequest,
  context: RouteContext<TParams>,
) => Promise<Response>;

/**
 * Types for specific route parameters
 */
export interface UserRouteParams {
  userId: string;
}

export interface GroupRouteParams {
  groupId: string;
}

export interface UserGroupRouteParams extends UserRouteParams {
  groupId: string;
}
