// Global API client with error handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));

      const error: ApiError = {
        message: errorData.message || `Грешка: ${response.statusText}`,
        statusCode: response.status,
      };

      throw error;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data as T;
    }

    return {} as T;
  } catch (error) {
    if (error instanceof Error) {
      const apiError: ApiError = {
        message: error.message || 'Възникна грешка при комуникация с API',
      };
      throw apiError;
    }
    throw error;
  }
}

