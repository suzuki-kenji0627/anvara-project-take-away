import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CampaignCard } from './campaign-card';

// Server actions cannot run in jsdom — replace with stubs
vi.mock('../actions', () => ({
  deleteCampaignAction: vi.fn(),
  saveCampaign: vi.fn(),
}));

const base = {
  id: 'camp-1',
  name: 'Summer Awareness Campaign',
  description: 'A campaign for summer',
  budget: 10000,
  spent: 2500,
  status: 'ACTIVE',
  startDate: '2026-06-01T00:00:00.000Z',
  endDate: '2026-08-31T00:00:00.000Z',
};

describe('CampaignCard', () => {
  it('renders the campaign name', () => {
    render(<CampaignCard campaign={base} />);
    expect(screen.getByText('Summer Awareness Campaign')).toBeInTheDocument();
  });

  it('renders the status badge', () => {
    render(<CampaignCard campaign={base} />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<CampaignCard campaign={base} />);
    expect(screen.getByText('A campaign for summer')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    const { description: _d, ...withoutDesc } = base;
    render(<CampaignCard campaign={withoutDesc} />);
    expect(screen.queryByText('A campaign for summer')).not.toBeInTheDocument();
  });

  it('renders formatted budget and spent amounts', () => {
    render(<CampaignCard campaign={base} />);
    expect(screen.getByText(/\$2,500/)).toBeInTheDocument();
    expect(screen.getByText(/\$10,000/)).toBeInTheDocument();
  });

  it('renders Edit and Delete buttons', () => {
    render(<CampaignCard campaign={base} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders PAUSED status badge', () => {
    render(<CampaignCard campaign={{ ...base, status: 'PAUSED' }} />);
    expect(screen.getByText('PAUSED')).toBeInTheDocument();
  });

  it('renders DRAFT status badge', () => {
    render(<CampaignCard campaign={{ ...base, status: 'DRAFT' }} />);
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
  });
});
