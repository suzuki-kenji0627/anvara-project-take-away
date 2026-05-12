'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdSlots } from '@/lib/api';
import { AdSlot } from '@/lib/types';
import { AdSlotGridSkeleton } from './ad-slot-grid-skeleton';

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

export function AdSlotGrid() {
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAdSlots()
      .then(setAdSlots)
      .catch(() => setError('Failed to load ad slots'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <AdSlotGridSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <svg
          className="mx-auto mb-3 h-10 w-10 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <h3 className="mb-1 font-semibold text-red-700">Couldn&apos;t load the marketplace</h3>
        <p className="mb-4 text-sm text-red-600">
          There was a problem fetching ad slots. Please try again.
        </p>
        <button
          onClick={load}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Try again
        </button>
      </div>
    );
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
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
          />
        </svg>
        <h3 className="mb-1 text-lg font-semibold">No ad slots available</h3>
        <p className="text-sm text-[--color-muted]">
          There are no ad slots listed right now. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <Link
          key={slot.id}
          href={`/marketplace/${slot.id}`}
          className="block rounded-lg border border-[--color-border] p-4 transition-shadow hover:shadow-md"
        >
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold">{slot.name}</h3>
            <span
              className={`rounded px-2 py-0.5 text-xs ${typeColors[slot.type] || 'bg-gray-100'}`}
            >
              {slot.type}
            </span>
          </div>

          {slot.publisher && (
            <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
          )}

          {slot.description && (
            <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
          )}

          <div className="flex items-center justify-between">
            <span
              className={`text-sm ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
            >
              {slot.isAvailable ? 'Available' : 'Booked'}
            </span>
            <span className="font-semibold text-[--color-primary]">
              ${Number(slot.basePrice).toLocaleString()}/mo
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
