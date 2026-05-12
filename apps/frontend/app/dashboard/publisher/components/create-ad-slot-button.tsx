'use client';

import { useState } from 'react';
import { Modal } from '@/app/components/modal';
import { AdSlotForm } from './ad-slot-form';

export function CreateAdSlotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        New Ad Slot
      </button>

      {isOpen && (
        <Modal title="Create Ad Slot" onClose={() => setIsOpen(false)}>
          <AdSlotForm onSuccess={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
