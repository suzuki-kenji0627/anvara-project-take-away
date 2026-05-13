import { cookies } from 'next/headers';
import { getAdSlots } from '@/lib/api';
import type { AdSlot } from '@/lib/types';
import { AdSlotCard } from './ad-slot-card';
import { CreateAdSlotButton } from './create-ad-slot-button';

interface AdSlotListProps {
  publisherId: string;
}

export async function AdSlotList({ publisherId }: AdSlotListProps) {
  const cookieStore = await cookies();
  let adSlots: AdSlot[];
  try {
    adSlots = await getAdSlots(publisherId, cookieStore.toString());
  } catch (err) {
    // Log server-side so the error appears in deployment logs — the client only
    // sees the error boundary UI and has no visibility into server component failures.
    // eslint-disable-next-line no-console
    console.error('[AdSlotList] Failed to fetch ad slots:', err);
    throw err;
  }

  if (adSlots.length === 0) {
    return (
      <div className="py-16 text-center">
        <svg
          className="mx-auto mb-4 h-12 w-12 text-[--color-muted]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>
        <h3 className="mb-1 text-lg font-semibold">No ad slots yet</h3>
        <p className="mb-6 text-sm text-[--color-muted]">
          Create your first ad slot to start earning from your audience.
        </p>
        <CreateAdSlotButton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <AdSlotCard key={slot.id} adSlot={slot} />
      ))}
    </div>
  );
}
