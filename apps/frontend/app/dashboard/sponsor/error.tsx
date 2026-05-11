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
      <p className="mb-4 text-red-600">{error.message || 'Something went wrong loading your campaigns.'}</p>
      <button
        onClick={reset}
        className="rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
      >
        Try again
      </button>
    </div>
  );
}
