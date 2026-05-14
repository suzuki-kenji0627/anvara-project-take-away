import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { CampaignList } from './components/campaign-list';
import { CampaignListSkeleton } from './components/campaign-list-skeleton';
import { CreateCampaignButton } from './components/create-campaign-button';

export default async function SponsorDashboard() {
  let session: Awaited<ReturnType<typeof auth.api.getSession>>;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[SponsorDashboard] Session check failed:', err);
    throw err;
  }

  if (!session?.user) {
    redirect('/login');
  }

  const cookieHeader = (await headers()).get('cookie') ?? undefined;

  let roleData: Awaited<ReturnType<typeof getUserRole>>;
  try {
    roleData = await getUserRole(cookieHeader);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[SponsorDashboard] Role check failed:', err);
    throw err;
  }

  if (roleData.role !== 'sponsor' || !roleData.sponsorId) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <CreateCampaignButton />
      </div>

      <Suspense fallback={<CampaignListSkeleton />}>
        <CampaignList sponsorId={roleData.sponsorId} />
      </Suspense>
    </div>
  );
}
