'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  createCampaign as apiCreateCampaign,
  updateCampaign as apiUpdateCampaign,
  deleteCampaign as apiDeleteCampaign,
} from '@/lib/api';

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

export async function saveCampaign(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string | null;
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const budgetRaw = formData.get('budget') as string;
  const startDate = (formData.get('startDate') as string)?.trim();
  const endDate = (formData.get('endDate') as string)?.trim();
  const cpmRateRaw = (formData.get('cpmRate') as string)?.trim();
  const cpcRateRaw = (formData.get('cpcRate') as string)?.trim();

  const budget = parseFloat(budgetRaw);
  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = 'Name is required';
  if (!budgetRaw || isNaN(budget) || budget <= 0) {
    fieldErrors.budget = 'Budget must be greater than 0';
  }
  if (!startDate) fieldErrors.startDate = 'Start date is required';
  if (!endDate) fieldErrors.endDate = 'End date is required';
  if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
    fieldErrors.endDate = 'End date must be after start date';
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const payload = {
    name,
    description: description || undefined,
    budget,
    startDate,
    endDate,
    ...(cpmRateRaw && { cpmRate: parseFloat(cpmRateRaw) }),
    ...(cpcRateRaw && { cpcRate: parseFloat(cpcRateRaw) }),
  };

  try {
    if (id) {
      await apiUpdateCampaign(id, payload, cookieHeader);
    } else {
      await apiCreateCampaign(payload, cookieHeader);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to save campaign' };
  }

  revalidatePath('/dashboard/sponsor');
  return { success: true };
}

export async function deleteCampaignAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  if (!id) return { error: 'Missing campaign ID' };

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    await apiDeleteCampaign(id, cookieHeader);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete campaign' };
  }

  revalidatePath('/dashboard/sponsor');
  return { success: true };
}
