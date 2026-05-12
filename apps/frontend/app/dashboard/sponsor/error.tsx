'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <svg
        className="mx-auto mb-3 h-10 w-10 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h3 className="mb-1 font-semibold text-red-700">Something went wrong</h3>
      <p className="mb-4 text-sm text-red-600">
        We couldn&apos;t load your campaigns. This is usually temporary.
      </p>
      <button
        onClick={reset}
        className="rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Try again
      </button>
    </div>
  );
}
