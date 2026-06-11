type Props = {
  page: number;
  pageSize: number;
  total: number;
  currentCount: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
};

export function NewsPagination({ page, pageSize, total, currentCount, totalPages, onPageChange }: Props) {
  const resolvedTotalPages = totalPages ?? (total > 0 ? Math.ceil(total / pageSize) : undefined);
  const canPrev = page > 1;
  const canNext = resolvedTotalPages ? page < resolvedTotalPages : currentCount >= pageSize;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p>
        Page <span className="font-bold text-slate-950">{page}</span>
        {resolvedTotalPages ? (
          <>
            {' '}
            of <span className="font-bold text-slate-950">{resolvedTotalPages}</span>
          </>
        ) : null}
        {total > 0 ? <span className="ml-2 text-slate-400">({total} total)</span> : null}
      </p>

      <div className="flex gap-2">
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canPrev}
          type="button"
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          className="rounded-lg border border-slate-300 px-4 py-2 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canNext}
          type="button"
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
