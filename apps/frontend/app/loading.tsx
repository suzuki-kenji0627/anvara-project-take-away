export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-slate-300 dark:bg-slate-600" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[--color-border] p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-5 w-32 rounded bg-slate-300 dark:bg-slate-600" />
              <div className="h-5 w-16 rounded bg-slate-300 dark:bg-slate-600" />
            </div>
            <div className="h-4 w-full rounded bg-slate-300 dark:bg-slate-600" />
            <div className="h-4 w-3/4 rounded bg-slate-300 dark:bg-slate-600" />
            <div className="flex justify-between pt-2">
              <div className="h-4 w-16 rounded bg-slate-300 dark:bg-slate-600" />
              <div className="h-4 w-20 rounded bg-slate-300 dark:bg-slate-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
