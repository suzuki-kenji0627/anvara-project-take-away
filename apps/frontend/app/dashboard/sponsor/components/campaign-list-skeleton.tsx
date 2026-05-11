export function CampaignListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-lg border border-[--color-border] p-4">
          <div className="mb-2 flex items-start justify-between">
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mb-3 h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="mb-2">
            <div className="flex justify-between">
              <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mt-1 h-1.5 w-full animate-pulse rounded-full bg-gray-200" />
          </div>
          <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
