'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  createAdSlot as apiCreateAdSlot,
  updateAdSlot as apiUpdateAdSlot,
  deleteAdSlot as apiDeleteAdSlot,
} from '@/lib/api';

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

const VALID_TYPES = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'] as const;
type AdSlotType = typeof VALID_TYPES[number];

function getString(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  return typeof v === 'string' ? v : null;
}

export async function saveAdSlot(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const id = getString(formData, 'id');
  const name = getString(formData, 'name')?.trim() ?? '';
  const description = getString(formData, 'description')?.trim();
  const type = getString(formData, 'type') ?? '';
  const basePriceRaw = getString(formData, 'basePrice') ?? '';
  const basePrice = parseFloat(basePriceRaw);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = 'Name is required';
  if (!type || !(VALID_TYPES as readonly string[]).includes(type)) fieldErrors.type = 'Type is required';
  if (!basePriceRaw || isNaN(basePrice) || basePrice <= 0) {
    fieldErrors.basePrice = 'Base price must be greater than 0';
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const payload = { name, description: description || undefined, type: type as AdSlotType, basePrice };

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
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = getString(formData, 'id');
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
