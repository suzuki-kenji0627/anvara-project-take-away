'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveAdSlot, type ActionState } from '../actions';
import type { AdSlot } from '@/lib/types';

interface AdSlotFormProps {
  adSlot?: Pick<AdSlot, 'id' | 'name' | 'description' | 'type' | 'basePrice'>;
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

export function AdSlotForm({ adSlot, onSuccess }: AdSlotFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveAdSlot, {});

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => onSuccess?.(), 800);
      return () => clearTimeout(timer);
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-3 text-left">
      {adSlot && <input type="hidden" name="id" value={adSlot.id} />}

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
          defaultValue={adSlot?.name}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          placeholder="e.g. Homepage Banner"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={adSlot?.description}
          rows={2}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Type *</label>
        <select
          name="type"
          defaultValue={adSlot?.type ?? ''}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
        >
          <option value="">Select type</option>
          <option value="DISPLAY">Display</option>
          <option value="VIDEO">Video</option>
          <option value="NEWSLETTER">Newsletter</option>
          <option value="PODCAST">Podcast</option>
        </select>
        {state.fieldErrors?.type && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.type}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Base Price ($/mo) *</label>
        <input
          name="basePrice"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={adSlot?.basePrice}
          className="w-full rounded-lg border border-[--color-border] bg-[--color-card] px-3 py-2 text-sm"
          placeholder="0.00"
        />
        {state.fieldErrors?.basePrice && (
          <p className="mt-1 text-xs text-red-500">{state.fieldErrors.basePrice}</p>
        )}
      </div>

      <div className="flex justify-end">
        <SubmitButton label={adSlot ? 'Update' : 'Create'} />
      </div>
    </form>
  );
}
