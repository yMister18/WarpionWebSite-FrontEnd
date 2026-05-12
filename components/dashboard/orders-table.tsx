'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EntityLink } from '@/components/dashboard/entity-link';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { RequeueOrderButton } from '@/components/dashboard/requeue-order-button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import type { OrderRecord } from '@/lib/warpion-api';

type Props = {
  orders: OrderRecord[];
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function getCommandStatusSummary(
  shopCommands: Array<{ id: string; status: string }>
) {
  const counts = shopCommands.reduce<Record<string, number>>((acc, command) => {
    acc[command.status] = (acc[command.status] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([status, count]) => `${status}: ${count}`)
    .join(' • ');
}

export function OrdersTable({ orders }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const deliveryFilter = searchParams.get('deliveryStatus') ?? 'ALL';
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') ?? '25'));

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery =
        !normalizedQuery ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        (order.externalId ?? '').toLowerCase().includes(normalizedQuery) ||
        order.player.username.toLowerCase().includes(normalizedQuery) ||
        order.player.uuid.toLowerCase().includes(normalizedQuery);

      const matchesDelivery =
        deliveryFilter === 'ALL' ||
        (order.deliveryStatus ?? '—').toUpperCase() === deliveryFilter;

      return matchesQuery && matchesDelivery;
    });
  }, [orders, query, deliveryFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim() && value !== 'ALL') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={query}
            onChange={(event) => updateParam('q', event.target.value)}
            placeholder="Pesquisar por order ID, external ID, player ou UUID..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-700 lg:min-w-[420px]"
          />

          <select
            value={deliveryFilter}
            onChange={(event) => updateParam('deliveryStatus', event.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-700"
          >
            <option value="ALL">All delivery states</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="FAILED">FAILED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>

        <div className="text-sm text-zinc-400">
          Resultados: <span className="font-semibold text-white">{filteredOrders.length}</span>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-sm text-zinc-400">
          Nenhuma order corresponde aos filtros.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-zinc-400">
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Player</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Payment</th>
                  <th className="px-3 py-2">Delivery</th>
                  <th className="px-3 py-2">Commands</th>
                  <th className="px-3 py-2">Updated At</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-200"
                  >
                    <td className="px-3 py-4 align-top">
                      <EntityLink
                        href={`/orders/${order.id}`}
                        label={order.id}
                        sublabel={order.externalId ? `External: ${order.externalId}` : 'External: —'}
                      />
                    </td>

                    <td className="px-3 py-4 align-top">
                      <div className="font-medium text-white">{order.player.username}</div>
                      <div className="mt-1 text-xs text-zinc-500">{order.player.uuid}</div>
                    </td>

                    <td className="px-3 py-4 align-top">
                      {order.totalAmount} {order.currency}
                    </td>

                    <td className="px-3 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={order.status} />
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">
                        Paid at: {formatDate(order.paidAt)}
                      </div>
                    </td>

                    <td className="px-3 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={order.deliveryStatus} />
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">
                        Completed: {formatDate(order.deliveryCompletedAt)}
                      </div>
                    </td>

                    <td className="px-3 py-4 align-top">
                      <div className="max-w-[260px] whitespace-normal break-words text-xs text-zinc-400">
                        {order.shopCommands.length > 0
                          ? getCommandStatusSummary(order.shopCommands)
                          : 'Sem commands'}
                      </div>
                    </td>

                    <td className="px-3 py-4 align-top">{formatDate(order.updatedAt)}</td>

                    <td className="px-3 py-4 align-top text-right">
                      <RequeueOrderButton orderId={order.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            totalItems={filteredOrders.length}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  );
}