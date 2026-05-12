const API_BASE_URL = process.env.WARPION_API_BASE_URL;
const INTERNAL_API_KEY = process.env.WARPION_INTERNAL_API_KEY;

function ensureEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = ensureEnv(API_BASE_URL, 'WARPION_API_BASE_URL');
  const internalApiKey = ensureEnv(
    INTERNAL_API_KEY,
    'WARPION_INTERNAL_API_KEY'
  );

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': internalApiKey,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        data?.message ||
        `Warpion API request failed with status ${response.status}`
    );
  }

  return data;
}

export type MetricsResponse = {
  success: boolean;
  data: {
    commands: {
      pending: number;
      published: number;
      processing: number;
      delivered: number;
      failed: number;
    };
    orders: {
      pendingPayment: number;
      paid: number;
      failedPayment: number;
      delivered: number;
      partial: number;
      processing: number;
    };
    generatedAt: string;
  };
};

export async function getMetrics() {
  return apiFetch<MetricsResponse>('/api/internal/shop/metrics');
}