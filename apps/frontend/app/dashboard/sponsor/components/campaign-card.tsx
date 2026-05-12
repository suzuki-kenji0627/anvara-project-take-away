'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteCampaignAction, type ActionState } from '../actions';
import { CampaignForm } from './campaign-form';
import { Modal } from '@/app/components/modal';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    description?: string;
    budget: number;
    spent: number;
    cpmRate?: number;
    cpcRate?: number;
    status: string;
    startDate: string;
    endDate: string;
  };
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

function DeleteConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? 'Deleting...' : 'Yes, delete'}
    </button>
  );
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteCampaignAction, {});

  const progress =
    campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;

  return (
    <>
      <div className="rounded-lg border border-[--color-border] p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold">{campaign.name}</h3>
          <span
            className={`rounded px-2 py-0.5 text-xs ${statusColors[campaign.status] || 'bg-gray-100'}`}
          >
            {campaign.status}
          </span>
        </div>

        {campaign.description && (
          <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{campaign.description}</p>
        )}

        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-[--color-muted]">Budget</span>
            <span>
              ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-[--color-primary]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-[--color-muted]">
          {new Date(campaign.startDate).toLocaleDateString()} -{' '}
          {new Date(campaign.endDate).toLocaleDateString()}
        </div>

        {deleteState.error && (
          <p className="mt-2 text-xs text-red-500">{deleteState.error}</p>
        )}

        {isConfirming ? (
          <div className="mt-3 flex items-center gap-2 border-t border-[--color-border] pt-3">
            <span className="text-xs text-[--color-muted]">Delete this campaign?</span>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={campaign.id} />
              <DeleteConfirmButton />
            </form>
            <button
              onClick={() => setIsConfirming(false)}
              className="rounded px-3 py-1 text-xs text-[--color-muted] hover:text-[--color-text]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-3 flex gap-2 border-t border-[--color-border] pt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer flex-1 rounded border border-[--color-border] py-1 text-xs font-medium hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => setIsConfirming(true)}
              className="cursor-pointer flex-1 rounded border border-red-200 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <Modal title="Edit Campaign" onClose={() => setIsEditing(false)}>
          <CampaignForm campaign={campaign} onSuccess={() => setIsEditing(false)} />
        </Modal>
      )}
    </>
  );
}
