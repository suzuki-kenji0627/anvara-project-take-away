// Frontend utility functions

// Format a price for display
export function formatPrice(price: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Returns a debounced version of fn that delays invocation by `delay` ms
export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Class name helper (simple cn alternative)
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Logger that only logs in development
export const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[App]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error('[App Error]', ...args);
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn('[App Warning]', ...args);
  },
};

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString();
}
