'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const OPTIONS = ['off', '15', '30', '60'] as const;

export function AutoRefreshSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const autoRefresh = searchParams.get('refresh') ?? 'off';

  useEffect(() => {
    if (autoRefresh === 'off') return;

    const delay = Number(autoRefresh) * 1000;

    if (Number.isNaN(delay) || delay <= 0) return;

    const interval = setInterval(() => {
      router.refresh();
    }, delay);

    return () => clearInterval(interval);
  }, [autoRefresh, router]);

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'off') {
      params.delete('refresh');
    } else {
      params.set('refresh', value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-zinc-400">Auto-refresh</label>
      <select
        value={OPTIONS.includes(autoRefresh as (typeof OPTIONS)[number]) ? autoRefresh : 'off'}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
      >
        <option value="off">Off</option>
        <option value="15">15s</option>
        <option value="30">30s</option>
        <option value="60">60s</option>
      </select>
    </div>
  );
}