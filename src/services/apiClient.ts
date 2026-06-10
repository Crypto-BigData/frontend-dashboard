const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

type QueryValue = string | number | boolean | null | undefined;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

function unwrapResponse<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const entries = Object.keys(payload);
    if (entries.length === 1) {
      return (payload as { data: unknown }).data as T;
    }
  }

  return payload as T;
}

async function parseError(response: Response): Promise<string> {
  const fallback = `API ${response.status}: ${response.statusText}`;

  try {
    const payload = await response.json();
    if (payload && typeof payload === 'object') {
      const message = (payload as { message?: unknown; error?: unknown }).message ?? (payload as { error?: unknown }).error;
      if (Array.isArray(message)) return message.join(', ');
      if (typeof message === 'string') return message;
    }
  } catch {
    try {
      const text = await response.text();
      if (text) return text;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export async function apiGet<T>(path: string, query?: Record<string, QueryValue>): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return unwrapResponse<T>(await response.json());
}

export async function apiPost<T, TBody = unknown>(path: string, body: TBody): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return unwrapResponse<T>(await response.json());
}
