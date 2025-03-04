/**
 * Base API service for making requests to the external API
 */
export class ApiService {
  private static baseUrl = process.env.PERMISSION_API_BASE_URL;
  private static apiCode = process.env.PERMISSION_API_CODE;

  protected static async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    if (!this.baseUrl || !this.apiCode) {
      throw new Error('Missing API configuration');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('code', this.apiCode);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-Version': '1.0',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API error response for ${endpoint}:`, errorBody);
        console.error('Request URL:', url.toString());
        console.error('Request headers:', options.headers);

        switch (response.status) {
          case 400:
            throw new Error(`Invalid request parameters: ${errorBody}`);
          case 401:
            throw new Error('Unauthorized - Authentication required');
          case 403:
            throw new Error('Forbidden - Insufficient permissions');
          case 404:
            throw new Error('Resource not found');
          case 409:
            throw new Error('Resource conflict');
          case 500:
            throw new Error(`Internal Server Error - ${errorBody}`);
          default:
            throw new Error(
              `API error (${response.status}): ${response.statusText} - ${errorBody}`,
            );
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed API request to ${endpoint}:`, error);
      throw error;
    }
  }

  protected static async fetchWithPagination<T>(
    endpoint: string,
    limit?: number,
    offset?: number,
    options: RequestInit = {},
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (limit) url.searchParams.append('limit', limit.toString());
    if (offset) url.searchParams.append('offset', offset.toString());
    return this.fetch<T>(url.pathname + url.search, options);
  }
}
