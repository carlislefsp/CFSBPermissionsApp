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

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error('Invalid request parameters');
        case 404:
          throw new Error('Resource not found');
        case 409:
          throw new Error('Resource conflict');
        default:
          throw new Error(`API error: ${response.statusText}`);
      }
    }

    return response.json();
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
