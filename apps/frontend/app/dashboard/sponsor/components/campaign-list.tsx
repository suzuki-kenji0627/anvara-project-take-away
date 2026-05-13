import { cookies } from 'next/headers';
import { getCampaigns } from '@/lib/api';
import type { Campaign } from '@/lib/types';
import { CampaignCard } from './campaign-card';
import { CreateCampaignButton } from './create-campaign-button';

interface CampaignListProps {
  sponsorId: string;
}

export async function CampaignList({ sponsorId }: CampaignListProps) {
  const cookieStore = await cookies();
  let campaigns: Campaign[];
  try {
    campaigns = await getCampaigns(sponsorId, cookieStore.toString());
  } catch (err) {
    // Log server-side so the error appears in deployment logs — the client only
    // sees the error boundary UI and has no visibility into server component failures.
    // eslint-disable-next-line no-console
    console.error('[CampaignList] Failed to fetch campaigns:', err);
    throw err;
  }

  if (campaigns.length === 0) {
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
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
          />
        </svg>
        <h3 className="mb-1 text-lg font-semibold">No campaigns yet</h3>
        <p className="mb-6 text-sm text-[--color-muted]">
          Create your first campaign to start reaching your target audience.
        </p>
        <CreateCampaignButton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
