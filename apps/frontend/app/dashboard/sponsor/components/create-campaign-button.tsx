'use client';

import { useState } from 'react';
import { Modal } from '@/app/components/modal';
import { CampaignForm } from './campaign-form';

export function CreateCampaignButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        New Campaign
      </button>

      {isOpen && (
        <Modal title="Create Campaign" onClose={() => setIsOpen(false)}>
          <CampaignForm onSuccess={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
