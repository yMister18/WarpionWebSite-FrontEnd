'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type PaginationControlsProps = {
  totalItems: number;
  currentPage: number;
  pageSize: number;
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function PaginationControls({
  totalItems,
  currentPage,
  pageSize,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  function updateParams(nextPage: number, nextPageSize: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage > 1) {
      params.set('page', String(nextPage));
    } else {
      params.delete('page');
    }

    if (nextPageSize !== 25) {
      params.set('pageSize', String(nextPageSize));
    } else {
      params.delete('pageSize');
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  function handlePrevious() {
    if (currentPage > 1) {
      updateParams(currentPage - 1, pageSize);
    }
  }

  function handleNext() {
    if (currentPage < totalPages) {
      updateParams(currentPage + 1, pageSize);
    }
  }

  function handlePageSizeChange(value: number) {
    updateParams(1, value);
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="text-sm text-zinc-400">
        A mostrar <span className="font-semibold text-white">{startItem}</span>–
        <span className="font-semibold text-white">{endItem}</span> de{' '}
        <span className="font-semibold text-white">{totalItems}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400">Page size</label>
          <select
            value={pageSize}
            onChange={(event) => handlePageSizeChange(Number(event.target.value))}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-700"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm text-zinc-300">
            Página <span className="font-semibold text-white">{currentPage}</span> de{' '}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}