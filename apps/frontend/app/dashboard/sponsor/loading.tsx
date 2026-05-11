import { CampaignListSkeleton } from './components/campaign-list-skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <CampaignListSkeleton />
    </div>
  );
}
