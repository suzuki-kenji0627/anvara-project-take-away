// Utility helpers for the API

// Helper to safely extract route params — throws for invalid input rather than
// silently returning '' which would produce confusing 404s downstream.
export function getParam(param: unknown): string {
  if (typeof param === 'string' && param.length > 0) return param;
  if (Array.isArray(param) && typeof param[0] === 'string' && param[0].length > 0) return param[0];
  throw new Error(`Invalid route parameter: ${String(param)}`);
}

// Validate email format using a pattern that enforces a valid TLD and rejects
// obvious structural issues (double @, leading/trailing dots, etc.)
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isEnumValue<T extends Record<string, string>>(
  value: unknown,
  enumObj: T
): value is T[keyof T] {
  return typeof value === 'string' && Object.values(enumObj).includes(value);
}
