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

export type CommandRecord = {
  id: string;
  orderId: string;
  playerId: string;
  command: string;
  status: string;
  attempts: number;
  lastError: string | null;
  publishedAt: string | null;
  processingStartedAt: string | null;
  processingOwner: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  player: {
    id: string;
    uuid: string;
    username: string;
  };
  order: {
    id: string;
    status: string;
    deliveryStatus: string | null;
  };
};

export type OrderRecord = {
  id: string;
  playerId: string;
  externalId: string | null;
  status: string;
  currency: string;
  totalAmount: string;
  paymentMethod: string | null;
  paidAt: string | null;
  commandsIssuedAt: string | null;
  deliveryStatus: string | null;
  deliveryCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  player: {
    id: string;
    uuid: string;
    username: string;
  };
  shopCommands: Array<{
    id: string;
    status: string;
  }>;
};

export type StuckCommandsResponse = {
  success: boolean;
  data: {
    cutoff: string;
    count: number;
    commands: CommandRecord[];
  };
};

export type FailedCommandsResponse = {
  success: boolean;
  data: {
    count: number;
    commands: CommandRecord[];
  };
};

export type OrdersResponse = {
  success: boolean;
  data: {
    count: number;
    orders: OrderRecord[];
  };
};

export type RequeueCommandResponse = {
  success: boolean;
  data: {
    shopCommand: CommandRecord;
  };
};

export type RequeueOrderResponse = {
  success: boolean;
  data: {
    requeuedCount: number;
    order: OrderRecord | null;
  };
};

export async function getMetrics() {
  return apiFetch<MetricsResponse>('/api/internal/shop/metrics');
}

export async function getStuckCommands() {
  return apiFetch<StuckCommandsResponse>('/api/internal/shop/stuck-commands');
}

export async function getFailedCommands() {
  return apiFetch<FailedCommandsResponse>('/api/internal/shop/failed-commands');
}

export async function getOrders() {
  return apiFetch<OrdersResponse>('/api/internal/shop/orders');
}

export async function requeueCommand(shopCommandId: string) {
  return apiFetch<RequeueCommandResponse>('/api/internal/shop/requeue-command', {
    method: 'POST',
    body: JSON.stringify({ shopCommandId }),
  });
}

export async function requeueOrder(orderId: string) {
  return apiFetch<RequeueOrderResponse>('/api/internal/shop/requeue-order', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}