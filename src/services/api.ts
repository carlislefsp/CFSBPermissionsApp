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
    const url = new URL(`${this.baseUrl}${endpoint}`);
    // Add API code as query parameter
    url.searchParams.append('code', this.apiCode || '');

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers here
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }
}
