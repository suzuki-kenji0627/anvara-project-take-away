import { describe, it, expect } from 'vitest';
import {
  getParam,
  isValidEmail,
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
