type MetricCardProps = {
  title: string;
  value: number;
  description?: string;
  accent?: 'blue' | 'green' | 'yellow' | 'red' | 'zinc';
};

const accentStyles: Record<NonNullable<MetricCardProps['accent']>, string> = {
  blue: 'border-blue-900/60 bg-blue-950/30 text-blue-100',
  green: 'border-green-900/60 bg-green-950/30 text-green-100',
  yellow: 'border-yellow-900/60 bg-yellow-950/30 text-yellow-100',
  red: 'border-red-900/60 bg-red-950/30 text-red-100',
  zinc: 'border-zinc-800 bg-zinc-900 text-zinc-100',
};

export function MetricCard({
  title,
  value,
  description,
  accent = 'zinc',
}: MetricCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-colors ${accentStyles[accent]}`}
    >
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {description ? (
        <p className="mt-2 text-sm opacity-75">{description}</p>
      ) : null}
    </div>
  );
}