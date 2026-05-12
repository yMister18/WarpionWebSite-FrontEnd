'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type RequeueOrderButtonProps = {
  orderId: string;
};

export function RequeueOrderButton({ orderId }: RequeueOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/requeue-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to requeue order');
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border border-blue-800 bg-blue-950/40 px-3 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-900/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Requeue...' : success ? 'Requeued' : 'Requeue Order'}
      </button>

      {success ? (
        <p className="text-xs text-green-400">Order reenfileirada.</p>
      ) : null}

      {error ? (
        <p className="max-w-[220px] text-right text-xs text-red-400">{error}</p>
      ) : null}
    </div>
  );
}