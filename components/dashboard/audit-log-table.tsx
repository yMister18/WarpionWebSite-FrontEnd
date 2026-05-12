'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PaginationControls } from '@/components/dashboard/pagination-controls';
import { StatusBadge } from '@/components/dashboard/status-badge';
import type { AdminActionLogRecord } from '@/lib/warpion-api';

type Props = {
  logs: AdminActionLogRecord[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function stringifyDetails(details: unknown) {
  if (!details) return '—';

  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return 'Invalid details';
  }
}

export function AuditLogTable({ logs }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const actionFilter = searchParams.get('action') ?? 'ALL';
  const entityTypeFilter = searchParams.get('entityType') ?? 'ALL';
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') ?? '25'));

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
      const matchesEntityType =
        entityTypeFilter === 'ALL' || log.entityType === entityTypeFilter;

      return matchesAction && matchesEntityType;
    });
  }, [logs, actionFilter, entityTypeFilter]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'ALL') {
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
          <select
            value={actionFilter}
            onChange={(event) => updateParam('action', event.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-700"
          >
            <option value="ALL">All actions</option>
            <option value="REQUEUE_COMMAND">REQUEUE_COMMAND</option>
            <option value="REQUEUE_ORDER">REQUEUE_ORDER</option>
          </select>

          <select
            value={entityTypeFilter}
            onChange={(event) => updateParam('entityType', event.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-700"
          >
            <option value="ALL">All entity types</option>
            <option value="SHOP_COMMAND">SHOP_COMMAND</option>
            <option value="ORDER">ORDER</option>
          </select>
        </div>

        <div className="text-sm text-zinc-400">
          Resultados: <span className="font-semibold text-white">{filteredLogs.length}</span>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-sm text-zinc-400">
          Nenhum log encontrado.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-zinc-400">
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2">Entity</th>
                  <th className="px-3 py-2">Actor</th>
                  <th className="px-3 py-2">Created At</th>
                  <th className="px-3 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-200"
                  >
                    <td className="px-3 py-4 align-top">
                      <StatusBadge value={log.action} />
                    </td>

                    <td className="px-3 py-4 align-top">
                      <div className="font-medium text-white">{log.entityType}</div>
                      <div className="mt-1 text-xs text-zinc-500">{log.entityId ?? '—'}</div>
                    </td>

                    <td className="px-3 py-4 align-top">{log.actor}</td>

                    <td className="px-3 py-4 align-top">{formatDate(log.createdAt)}</td>

                    <td className="px-3 py-4 align-top">
                      <pre className="max-w-[420px] overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-950/70 p-3 text-xs text-zinc-400">
                        {stringifyDetails(log.details)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            totalItems={filteredLogs.length}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  );
}