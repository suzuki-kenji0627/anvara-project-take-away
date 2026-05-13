import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserRole } from '@/lib/auth-helpers';
import { AdSlotList } from './components/ad-slot-list';
import { AdSlotListSkeleton } from './components/ad-slot-list-skeleton';
import { CreateAdSlotButton } from './components/create-ad-slot-button';

export default async function PublisherDashboard() {
  let session: Awaited<ReturnType<typeof auth.api.getSession>>;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[PublisherDashboard] Session check failed:', err);
    throw err;
  }

  if (!session?.user) {
    redirect('/login');
  }

  const cookieHeader = (await headers()).get('cookie') ?? undefined;

  let roleData: Awaited<ReturnType<typeof getUserRole>>;
  try {
    roleData = await getUserRole(session.user.id, cookieHeader);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[PublisherDashboard] Role check failed:', err);
    throw err;
  }

  if (roleData.role !== 'publisher' || !roleData.publisherId) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        <CreateAdSlotButton />
      </div>

      <Suspense fallback={<AdSlotListSkeleton />}>
        <AdSlotList publisherId={roleData.publisherId} />
      </Suspense>
    </div>
  );
}
