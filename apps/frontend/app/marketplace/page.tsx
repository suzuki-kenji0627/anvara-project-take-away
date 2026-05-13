import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { AdSlotGrid } from './components/ad-slot-grid';
import { AdSlotGridSkeleton } from './components/ad-slot-grid-skeleton';
import { MarketplaceFilters } from './components/marketplace-filters';
import { getAvailableAdSlots, ApiError } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Browse available ad slots from our publishers.',
};

async function AdSlotGridLoader({ type, search }: { type?: string; search?: string }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let adSlots: Awaited<ReturnType<typeof getAvailableAdSlots>> = [];
  let isUnauthenticated = false;
  let error: string | null = null;

  try {
    adSlots = await getAvailableAdSlots({ type, search }, cookieHeader);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      isUnauthenticated = true;
    } else {
      error = 'There was a problem fetching ad slots. Please try again.';
    }
  }

  return <AdSlotGrid adSlots={adSlots} isUnauthenticated={isUnauthenticated} error={error} />;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>;
}) {
  const { type, search } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
      </div>

      <MarketplaceFilters initialType={type} initialSearch={search} />

      <Suspense fallback={<AdSlotGridSkeleton />}>
        <AdSlotGridLoader type={type} search={search} />
      </Suspense>
    </div>
  );
}
