'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  createAdSlot as apiCreateAdSlot,
  updateAdSlot as apiUpdateAdSlot,
  deleteAdSlot as apiDeleteAdSlot,
} from '@/lib/api';
import type { AdSlot } from '@/lib/types';

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

const VALID_TYPES = ['DISPLAY', 'VIDEO', 'NEWSLETTER', 'PODCAST'];

export async function saveAdSlot(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string | null;
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const type = formData.get('type') as string;
  const basePriceRaw = formData.get('basePrice') as string;
  const basePrice = parseFloat(basePriceRaw);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Name is required';
  if (!type || !VALID_TYPES.includes(type)) fieldErrors.type = 'Type is required';
  if (!basePriceRaw || isNaN(basePrice) || basePrice <= 0) {
    fieldErrors.basePrice = 'Base price must be greater than 0';
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const payload = { name, description: description || undefined, type: type as AdSlot['type'], basePrice };

  try {
    if (id) {
      await apiUpdateAdSlot(id, payload, cookieHeader);
    } else {
      await apiCreateAdSlot(payload, cookieHeader);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to save ad slot' };
  }

  revalidatePath('/dashboard/publisher');
  return { success: true };
}

export async function deleteAdSlotAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  if (!id) return { error: 'Missing ad slot ID' };

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    await apiDeleteAdSlot(id, cookieHeader);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete ad slot' };
  }

  revalidatePath('/dashboard/publisher');
  return { success: true };
}
