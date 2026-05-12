import { AdSlot, Campaign, DashboardStats, Placement } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291';

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const { headers: optionHeaders, ...restOptions } = options ?? {};
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...optionHeaders },
    ...restOptions,
  });
  if (!res.ok) {
    let message = 'API request failed';
    try {
      const data = await res.json();
      if (data.error) message = data.error;
    } catch {
      // ignore parse errors on error responses
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Campaigns
export const getCampaigns = (sponsorId?: string, cookieHeader?: string) =>
  api<Campaign[]>(
    sponsorId ? `/api/campaigns?sponsorId=${sponsorId}` : '/api/campaigns',
    cookieHeader ? { headers: { Cookie: cookieHeader } } : undefined
  );
export const getCampaign = (id: string) => api<Campaign>(`/api/campaigns/${id}`);
export const createCampaign = (data: Partial<Campaign>, cookieHeader?: string) =>
  api<Campaign>('/api/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
    ...(cookieHeader && { headers: { Cookie: cookieHeader } }),
  });
export const updateCampaign = (id: string, data: Partial<Campaign>, cookieHeader?: string) =>
  api<Campaign>(`/api/campaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...(cookieHeader && { headers: { Cookie: cookieHeader } }),
  });
export const deleteCampaign = (id: string, cookieHeader?: string) =>
  api<void>(`/api/campaigns/${id}`, {
    method: 'DELETE',
    ...(cookieHeader && { headers: { Cookie: cookieHeader } }),
  });

// Ad Slots
export const getAdSlots = (publisherId?: string, cookieHeader?: string) =>
  api<AdSlot[]>(
    publisherId ? `/api/ad-slots?publisherId=${publisherId}` : '/api/ad-slots',
    cookieHeader ? { headers: { Cookie: cookieHeader } } : undefined
  );
export const getAdSlot = (id: string) => api<AdSlot>(`/api/ad-slots/${id}`);
export const createAdSlot = (data: Partial<AdSlot>, cookieHeader?: string) =>
  api<AdSlot>('/api/ad-slots', {
    method: 'POST',
    body: JSON.stringify(data),
    ...(cookieHeader && { headers: { Cookie: cookieHeader } }),
  });
export const updateAdSlot = (id: string, data: Partial<AdSlot>, cookieHeader?: string) =>
  api<AdSlot>(`/api/ad-slots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...(cookieHeader && { headers: { Cookie: cookieHeader } }),
  });
export const deleteAdSlot = (id: string, cookieHeader?: string) =>
  api<void>(`/api/ad-slots/${id}`, {
    method: 'DELETE',
    ...(cookieHeader && { headers: { Cookie: cookieHeader } }),
  });

// Placements
export const getPlacements = () => api<Placement[]>(`/api/placements`);
export const createPlacement = (data: Placement) =>
  api('/api/placements', { method: 'POST', body: JSON.stringify(data) });

// Dashboard
export const getStats = () => api<DashboardStats>('/api/dashboard/stats');
