type StatusBadgeProps = {
  value: string | null | undefined;
};

function getStatusClasses(value: string) {
  switch (value.toUpperCase()) {
    case 'DELIVERED':
      return 'border-green-800 bg-green-950/40 text-green-300';
    case 'FAILED':
      return 'border-red-800 bg-red-950/40 text-red-300';
    case 'PROCESSING':
      return 'border-blue-800 bg-blue-950/40 text-blue-300';
    case 'PENDING':
      return 'border-yellow-800 bg-yellow-950/40 text-yellow-300';
    case 'PUBLISHED':
      return 'border-cyan-800 bg-cyan-950/40 text-cyan-300';
    case 'PAID':
      return 'border-emerald-800 bg-emerald-950/40 text-emerald-300';
    case 'PARTIAL':
      return 'border-orange-800 bg-orange-950/40 text-orange-300';
    case 'CANCELED':
      return 'border-zinc-700 bg-zinc-900 text-zinc-300';
    case 'REFUNDED':
      return 'border-purple-800 bg-purple-950/40 text-purple-300';
    default:
      return 'border-zinc-700 bg-zinc-900 text-zinc-300';
  }
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const label = value ?? '—';

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
        label
      )}`}
    >
      {label}
    </span>
  );
}