'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="mb-4 text-red-600">{error.message || 'Something went wrong loading your ad slots.'}</p>
      <button
        onClick={reset}
        className="rounded px-4 py-2 text-sm text-white"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Try again
      </button>
    </div>
  );
}
