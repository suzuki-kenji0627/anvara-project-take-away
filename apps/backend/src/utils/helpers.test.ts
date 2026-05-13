import { describe, it, expect } from 'vitest';
import {
  getParam,
  formatCurrency,
  calculatePercentChange,
  parsePagination,
  isValidEmail,
  buildFilters,
  clampValue,
  formatDate,
} from './helpers.js';

describe('getParam', () => {
  it('returns a string param as-is', () => {
    expect(getParam('abc')).toBe('abc');
  });

  it('returns the first element when given an array', () => {
    expect(getParam(['first', 'second'])).toBe('first');
  });

  it('returns empty string for an empty array', () => {
    expect(getParam([])).toBe('');
  });

  it('returns empty string for a number', () => {
    expect(getParam(42)).toBe('');
  });

  it('returns empty string for null', () => {
    expect(getParam(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(getParam(undefined)).toBe('');
  });
});

describe('formatCurrency', () => {
  it('formats a whole number as USD', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats a decimal value', () => {
    expect(formatCurrency(9.99)).toBe('$9.99');
  });

  it('respects a custom currency', () => {
    expect(formatCurrency(50, 'EUR')).toContain('50');
  });
});

describe('calculatePercentChange', () => {
  it('calculates a positive change', () => {
    expect(calculatePercentChange(100, 150)).toBe(50);
  });

  it('calculates a negative change', () => {
    expect(calculatePercentChange(200, 100)).toBe(-50);
  });

  it('returns 0 when values are equal', () => {
    expect(calculatePercentChange(100, 100)).toBe(0);
  });

  it('returns 100 when old value is 0 and new value is positive', () => {
    expect(calculatePercentChange(0, 500)).toBe(100);
  });

  it('returns 0 when both values are 0', () => {
    expect(calculatePercentChange(0, 0)).toBe(0);
  });
});

describe('parsePagination', () => {
  it('parses page and limit correctly', () => {
    const result = parsePagination({ page: '2', limit: '5' });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.skip).toBe(5);
  });

  it('defaults to page 1 and limit 10 for invalid input', () => {
    const result = parsePagination({ page: 'abc', limit: 'xyz' });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(0);
  });

  it('computes skip as (page - 1) * limit', () => {
    const result = parsePagination({ page: '3', limit: '20' });
    expect(result.skip).toBe(40);
  });

  it('defaults page 1 when page is 0', () => {
    const result = parsePagination({ page: '0', limit: '10' });
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });
});

describe('isValidEmail', () => {
  it('accepts a valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('accepts an email with subdomain', () => {
    expect(isValidEmail('user@mail.example.com')).toBe(true);
  });

  it('rejects an email missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects an email missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects an email with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });
});

describe('buildFilters', () => {
  it('includes only allowed fields present in query', () => {
    const result = buildFilters({ name: 'Alice', age: 30, role: 'admin' }, ['name', 'role']);
    expect(result).toEqual({ name: 'Alice', role: 'admin' });
  });

  it('excludes fields not in allowedFields', () => {
    const result = buildFilters({ secret: 'x', name: 'Bob' }, ['name']);
    expect(result).not.toHaveProperty('secret');
  });

  it('returns an empty object when query is empty', () => {
    expect(buildFilters({}, ['name', 'age'])).toEqual({});
  });

  it('returns an empty object when no allowed fields match', () => {
    expect(buildFilters({ foo: 'bar' }, ['name'])).toEqual({});
  });

  it('excludes fields whose value is undefined', () => {
    const result = buildFilters({ name: undefined, age: 25 }, ['name', 'age']);
    expect(result).not.toHaveProperty('name');
    expect(result).toHaveProperty('age', 25);
  });
});

describe('clampValue', () => {
  it('returns the value when within range', () => {
    expect(clampValue(5, 1, 10)).toBe(5);
  });

  it('clamps to min when value is below range', () => {
    expect(clampValue(-5, 0, 100)).toBe(0);
  });

  it('clamps to max when value is above range', () => {
    expect(clampValue(200, 0, 100)).toBe(100);
  });

  it('returns min when value equals min', () => {
    expect(clampValue(0, 0, 10)).toBe(0);
  });

  it('returns max when value equals max', () => {
    expect(clampValue(10, 0, 10)).toBe(10);
  });
});

describe('formatDate', () => {
  it('formats a valid Date object', () => {
    const result = formatDate(new Date('2024-01-15'));
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toBe('Invalid date');
  });

  it('returns "Invalid date" for an invalid Date', () => {
    expect(formatDate(new Date('not-a-date'))).toBe('Invalid date');
  });
});
