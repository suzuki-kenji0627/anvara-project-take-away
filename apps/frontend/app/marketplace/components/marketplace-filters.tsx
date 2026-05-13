'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { debounce } from '@/lib/utils';

const AD_SLOT_TYPES = ['DISPLAY', 'VIDEO', 'NEWSLETTER', 'PODCAST'] as const;

export function MarketplaceFilters({
  initialType,
  initialSearch,
}: {
  initialType?: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch ?? '');

  function pushParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`);
  }

  const debouncedSearch = useMemo(
    () => debounce((value: string) => pushParams({ search: value || undefined }), 350),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={initialType ?? ''}
        onChange={(e) => pushParams({ type: e.target.value || undefined })}
        className="rounded-lg border border-[--color-border] bg-transparent px-3 py-2 text-sm"
      >
        <option value="">All types</option>
        {AD_SLOT_TYPES.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </option>
        ))}
      </select>

      <input
        type="search"
        placeholder="Search by name, description, or publisher..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          debouncedSearch(e.target.value);
        }}
        className="min-w-48 flex-1 rounded-lg border border-[--color-border] bg-transparent px-3 py-2 text-sm"
      />
    </div>
  );
}
