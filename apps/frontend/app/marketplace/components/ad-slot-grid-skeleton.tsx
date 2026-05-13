export function AdSlotGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-[--color-border] p-4">
          <div className="mb-2 flex items-start justify-between">
            <div className="h-5 w-2/3 rounded bg-slate-300 dark:bg-slate-600" />
            <div className="h-5 w-16 rounded bg-slate-300 dark:bg-slate-600" />
          </div>
          <div className="mb-2 h-4 w-1/3 rounded bg-slate-300 dark:bg-slate-600" />
          <div className="mb-3 space-y-1">
            <div className="h-3 w-full rounded bg-slate-300 dark:bg-slate-600" />
            <div className="h-3 w-4/5 rounded bg-slate-300 dark:bg-slate-600" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-16 rounded bg-slate-300 dark:bg-slate-600" />
            <div className="h-5 w-20 rounded bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>
      ))}
    </div>
  );
}
