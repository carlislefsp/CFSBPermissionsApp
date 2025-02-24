/**
 * Base API service for making requests to the external API
 */
export class ApiService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL;

  protected static async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
