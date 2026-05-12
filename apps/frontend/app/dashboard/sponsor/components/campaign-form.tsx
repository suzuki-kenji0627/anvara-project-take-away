'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveCampaign, type ActionState } from '../actions';
import type { Campaign } from '@/lib/types';

interface CampaignFormProps {
  campaign?: Pick<Campaign, 'id' | 'name' | 'description' | 'budget' | 'startDate' | 'endDate' | 'cpmRate' | 'cpcRate'>;
  onSuccess?: () => void;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      {pending ? 'Saving...' : label}
    </button>
  );
}

function toDateInputValue(dateStr?: string): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
}

export function CampaignForm({ campaign, onSuccess }: CampaignFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveCampaign, {});

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => onSuccess?.(), 800);
      return () => clearTimeout(timer);
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-3">
      {campaign && <input type="hidden" name="id" value={campaign.id} />}

      {state.success && (
        <p className="rounded bg-green-50 p-2 text-sm text-green-600">Saved!</p>
      )}
      {state.error && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-600">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Name *</label>
        <input
          name="name"
          type="text"
          defaultValue={campaign?.name}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          placeholder="e.g. Summer Sale Campaign"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={campaign?.description}
          rows={2}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Budget ($) *</label>
        <input
          name="budget"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={campaign?.budget}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          placeholder="0.00"
        />
        {state.fieldErrors?.budget && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.budget}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Start Date *</label>
          <input
            name="startDate"
            type="date"
            defaultValue={toDateInputValue(campaign?.startDate)}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.startDate && (
            <p className="mt-1 text-xs text-red-500">{state.fieldErrors.startDate}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">End Date *</label>
          <input
            name="endDate"
            type="date"
            defaultValue={toDateInputValue(campaign?.endDate)}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          />
          {state.fieldErrors?.endDate && (
            <p className="mt-1 text-xs text-red-500">{state.fieldErrors.endDate}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">CPM Rate (optional)</label>
          <input
            name="cpmRate"
            type="number"
            step="0.01"
            min="0"
            defaultValue={campaign?.cpmRate ?? ''}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">CPC Rate (optional)</label>
          <input
            name="cpcRate"
            type="number"
            step="0.01"
            min="0"
            defaultValue={campaign?.cpcRate ?? ''}
            className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton label={campaign ? 'Update' : 'Create'} />
      </div>
    </form>
  );
}
