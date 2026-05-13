import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatPrice,
  debounce,
  parseQueryString,
  truncate,
  cn,
  sleep,
  deepClone,
  formatRelativeTime,
  isClient,
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

describe('parseQueryString', () => {
  it('parses a simple key=value pair', () => {
    expect(parseQueryString('foo=bar')).toEqual({ foo: 'bar' });
  });

  it('parses multiple pairs', () => {
    expect(parseQueryString('a=1&b=2')).toEqual({ a: '1', b: '2' });
  });

  it('returns an empty object for an empty string', () => {
    expect(parseQueryString('')).toEqual({});
  });

  it('handles URL-encoded values', () => {
    const result = parseQueryString('name=hello%20world');
    expect(result.name).toBe('hello world');
  });
});

describe('deepClone', () => {
  it('returns an equal but distinct object', () => {
    const original = { a: 1, b: { c: 2 } };
    const clone = deepClone(original);
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
  });

  it('does not share nested references', () => {
    const original = { nested: { value: 42 } };
    const clone = deepClone(original);
    clone.nested.value = 99;
    expect(original.nested.value).toBe(42);
  });

  it('clones arrays correctly', () => {
    const original = [1, 2, [3, 4]];
    const clone = deepClone(original);
    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);
  });
});

describe('sleep', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves after the specified delay', async () => {
    const promise = sleep(500);
    vi.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
  });

  it('does not resolve before the delay elapses', () => {
    let resolved = false;
    sleep(1000).then(() => { resolved = true; });
    vi.advanceTimersByTime(999);
    expect(resolved).toBe(false);
  });
});

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('calls the function after the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('resets the timer when called again before delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('passes arguments through to the original function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced('hello', 42);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('hello', 42);
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

describe('isClient', () => {
  it('is true in jsdom environment', () => {
    expect(isClient).toBe(true);
  });
});
