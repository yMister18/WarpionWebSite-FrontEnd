'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function RefreshButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    setLoading(true);
    router.refresh();

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-600 hover:text-white disabled:opacity-60"
    >
      {loading ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}