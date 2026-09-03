export const API_HOSTS = {
  responserift: 'https://responserift.dev/api',
} as const;

export class ApiError extends Error {
  constructor(public status: number, public data: unknown, message?: string) {
    super(message || `API Error: ${status}`);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

export function createApiClient(baseUrl: string = API_HOSTS.responserift) {
  const cleanBase = baseUrl.replace(/\/+$/, '');

  async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, body, headers, ...customConfig } = options;

    const isAbsolute = /^https?:\/\//i.test(endpoint);
    let url = isAbsolute ? endpoint : `${cleanBase}/${endpoint.replace(/^\/+/, '')}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      const qs = searchParams.toString();
      if (qs) url += `${url.includes('?') ? '&' : '?'}${qs}`;
    }

    const isJson = body && typeof body === 'object' && !(body instanceof FormData);

    const response = await fetch(url, {
      ...customConfig,
      headers: {
        ...(isJson ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: isJson ? JSON.stringify(body) : (body as RequestInit['body']),
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(response.status, errorData, response.statusText);
    }

    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  }

  return {
    get: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'POST', body }),
    put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'PUT', body }),
    patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'PATCH', body }),
    delete: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'DELETE' }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

export const api = createApiClient();
