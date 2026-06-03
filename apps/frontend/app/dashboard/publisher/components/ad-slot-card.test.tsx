'use client';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdSlotCard } from './ad-slot-card';

// Server actions cannot run in jsdom — replace with stubs
vi.mock('../actions', () => ({
  deleteAdSlotAction: vi.fn(),
  saveAdSlot: vi.fn(),
}));

const base = {
  id: 'slot-1',
  name: 'Homepage Banner',
  description: 'Top of page banner',
  type: 'DISPLAY' as const,
  basePrice: 1200,
  isAvailable: true,
};

describe('AdSlotCard', () => {
  it('renders the ad slot name', () => {
    render(<AdSlotCard adSlot={base} />);
    expect(screen.getByText('Homepage Banner')).toBeInTheDocument();
  });

  it('renders the type badge', () => {
    render(<AdSlotCard adSlot={base} />);
    expect(screen.getByText('DISPLAY')).toBeInTheDocument();
  });

  it('renders "Available" when isAvailable is true', () => {
    render(<AdSlotCard adSlot={base} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders "Booked" when isAvailable is false', () => {
    render(<AdSlotCard adSlot={{ ...base, isAvailable: false }} />);
    expect(screen.getByText('Booked')).toBeInTheDocument();
  });

  it('renders the formatted base price', () => {
    render(<AdSlotCard adSlot={base} />);
    expect(screen.getByText(/\$1,200/)).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<AdSlotCard adSlot={base} />);
    expect(screen.getByText('Top of page banner')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    const { description: _d, ...withoutDesc } = base;
    render(<AdSlotCard adSlot={withoutDesc} />);
    expect(screen.queryByText('Top of page banner')).not.toBeInTheDocument();
  });

  it('renders Edit and Delete buttons', () => {
    render(<AdSlotCard adSlot={base} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders NEWSLETTER type badge', () => {
    render(<AdSlotCard adSlot={{ ...base, type: 'NEWSLETTER' }} />);
    expect(screen.getByText('NEWSLETTER')).toBeInTheDocument();
  });
});
