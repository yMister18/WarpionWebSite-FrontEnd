import { AutoRefreshSelect } from '@/components/dashboard/auto-refresh-select';
import { RefreshButton } from '@/components/dashboard/refresh-button';

export function PageToolbar() {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <AutoRefreshSelect />
      <RefreshButton />
    </div>
  );
}