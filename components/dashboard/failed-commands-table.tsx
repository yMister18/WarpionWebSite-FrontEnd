'use client';

import { useMemo, useState } from 'react';
import { RequeueCommandButton } from '@/components/dashboard/requeue-command-button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import type { CommandRecord } from '@/lib/warpion-api';

type Props = {
  commands: CommandRecord[];
};

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function FailedCommandsTable({ commands }: Props) {
  const [query, setQuery] = useState('');

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return commands;

    return commands.filter((command) => {
      return (
        command.id.toLowerCase().includes(normalizedQuery) ||
        command.command.toLowerCase().includes(normalizedQuery) ||
        command.player.username.toLowerCase().includes(normalizedQuery) ||
        command.player.uuid.toLowerCase().includes(normalizedQuery) ||
        command.order.id.toLowerCase().includes(normalizedQuery) ||
        (command.lastError ?? '').toLowerCase().includes(normalizedQuery)
      );
    });
  }, [commands, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar por command ID, player, UUID, erro ou order..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-700 lg:max-w-xl"
        />

        <div className="text-sm text-zinc-400">
          Resultados: <span className="font-semibold text-white">{filteredCommands.length}</span>
        </div>
      </div>

      {filteredCommands.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-sm text-zinc-400">
          Nenhum comando corresponde à pesquisa.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-zinc-400">
                <th className="px-3 py-2">Command</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Updated At</th>
                <th className="px-3 py-2">Attempts</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCommands.map((command) => (
                <tr
                  key={command.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-200"
                >
                  <td className="px-3 py-4 align-top">
                    <div className="font-medium text-white">{command.id}</div>
                    <div className="mt-1 max-w-[280px] truncate text-xs text-zinc-500">
                      {command.command}
                    </div>
                    {command.lastError ? (
                      <div className="mt-2 max-w-[280px] text-xs text-red-300">
                        {command.lastError}
                      </div>
                    ) : null}
                  </td>

                  <td className="px-3 py-4 align-top">
                    <StatusBadge value={command.status} />
                  </td>

                  <td className="px-3 py-4 align-top">
                    <div className="font-medium text-white">{command.player.username}</div>
                    <div className="mt-1 text-xs text-zinc-500">{command.player.uuid}</div>
                  </td>

                  <td className="px-3 py-4 align-top">
                    <div className="font-medium text-white">{command.order.id}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge value={command.order.status} />
                      <StatusBadge value={command.order.deliveryStatus} />
                    </div>
                  </td>

                  <td className="px-3 py-4 align-top">{formatDate(command.updatedAt)}</td>

                  <td className="px-3 py-4 align-top">{command.attempts}</td>

                  <td className="px-3 py-4 align-top text-right">
                    <RequeueCommandButton shopCommandId={command.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}