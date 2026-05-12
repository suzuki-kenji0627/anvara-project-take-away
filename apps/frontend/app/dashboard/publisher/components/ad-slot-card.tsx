'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteAdSlotAction, type ActionState } from '../actions';
import { AdSlotForm } from './ad-slot-form';
import { Modal } from '@/app/components/modal';

interface AdSlotCardProps {
  adSlot: {
    id: string;
    name: string;
    description?: string;
    type: 'DISPLAY' | 'VIDEO' | 'NEWSLETTER' | 'PODCAST';
    basePrice: number;
    isAvailable: boolean;
  };
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
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

export function AdSlotCard({ adSlot }: AdSlotCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [deleteState, deleteAction] = useActionState<ActionState, FormData>(deleteAdSlotAction, {});

  return (
    <>
      <div className="rounded-lg border border-[--color-border] p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold">{adSlot.name}</h3>
          <span className={`rounded px-2 py-0.5 text-xs ${typeColors[adSlot.type] || 'bg-gray-100'}`}>
            {adSlot.type}
          </span>
        </div>

        {adSlot.description && (
          <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{adSlot.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-sm ${adSlot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}>
            {adSlot.isAvailable ? 'Available' : 'Booked'}
          </span>
          <span className="font-semibold text-[--color-primary]">
            ${Number(adSlot.basePrice).toLocaleString()}/mo
          </span>
        </div>

        {deleteState.error && (
          <p className="mt-2 text-xs text-red-500">{deleteState.error}</p>
        )}

        {isConfirming ? (
          <div className="mt-3 flex items-center gap-2 border-t border-[--color-border] pt-3">
            <span className="text-xs text-[--color-muted]">Delete this ad slot?</span>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={adSlot.id} />
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
              className="flex-1 rounded border border-red-200 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing && (
        <Modal title="Edit Ad Slot" onClose={() => setIsEditing(false)}>
          <AdSlotForm adSlot={adSlot} onSuccess={() => setIsEditing(false)} />
        </Modal>
      )}
    </>
  );
}
