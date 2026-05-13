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

  it('throws for an empty array', () => {
    expect(() => getParam([])).toThrow();
  });

  it('throws for a number', () => {
    expect(() => getParam(42)).toThrow();
  });

  it('throws for null', () => {
    expect(() => getParam(null)).toThrow();
  });

  it('throws for undefined', () => {
    expect(() => getParam(undefined)).toThrow();
  });

  it('throws for an empty string', () => {
    expect(() => getParam('')).toThrow();
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

  it('rejects a domain without a TLD', () => {
    expect(isValidEmail('user@localhost')).toBe(false);
  });

  it('rejects a domain starting with a hyphen', () => {
    expect(isValidEmail('user@-example.com')).toBe(false);
  });
});
