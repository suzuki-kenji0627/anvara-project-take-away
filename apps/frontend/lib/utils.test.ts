import { describe, it, expect, vi } from 'vitest';
import {
  formatPrice,
  truncate,
  cn,
  formatRelativeTime,
  debounce,
} from './utils';

describe('formatPrice', () => {
  it('formats a whole number as USD', () => {
    expect(formatPrice(1000)).toBe('$1,000.00');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats a decimal value', () => {
    expect(formatPrice(9.99)).toBe('$9.99');
  });

  it('respects a custom locale', () => {
    const result = formatPrice(1000, 'en-GB');
    expect(result).toContain('1,000');
  });
});

describe('truncate', () => {
  it('returns the original string when shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string when equal to maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and appends ellipsis when longer than maxLength', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('handles an empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});

describe('cn', () => {
  it('joins multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false, null, undefined, 0, 'bar')).toBe('foo bar');
  });

  it('returns empty string when all values are falsy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('returns a single class name unchanged', () => {
    expect(cn('only')).toBe('only');
  });
});

describe('debounce', () => {
  it('calls the function after the delay', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('a');

    vi.useRealTimers();
  });

  it('only calls once when invoked multiple times within the delay', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    debounced('b');
    debounced('c');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');

    vi.useRealTimers();
  });
});

describe('formatRelativeTime', () => {
  it('returns "Today" for a date from earlier today', () => {
    const today = new Date();
    expect(formatRelativeTime(today)).toBe('Today');
  });

  it('returns "Yesterday" for a date 1 day ago', () => {
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    expect(formatRelativeTime(yesterday)).toBe('Yesterday');
  });

  it('returns "N days ago" for dates within the past week', () => {
    const threeDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
  });

  it('returns a locale date string for dates older than 7 days', () => {
    const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10);
    const result = formatRelativeTime(oldDate);
    expect(result).not.toContain('days ago');
    expect(result).not.toBe('Today');
    expect(result).not.toBe('Yesterday');
  });
});
