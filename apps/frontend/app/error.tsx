'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
      <p className="mb-6 max-w-md text-sm text-[--color-muted]">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
      >
        Try again
      </button>
    </div>
  );
}
