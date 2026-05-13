'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/auth-client';
import { cn, truncate } from '@/lib/utils';
import type { UserRole } from '@/lib/auth-helpers';

export function Nav() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [role, setRole] = useState<UserRole>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (user?.id) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4291'}/api/auth/role/${user.id}`,
        { credentials: 'include' }
      )
        .then((res) => res.json())
        .then((data: { role: UserRole }) => setRole(data.role))
        .catch(() => setRole(null));
    }
  }, [user?.id]);

  const navLink = (href: string, label: string) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        style={isActive ? { color: 'var(--color-primary)' } : undefined}
        className={cn(
          'border-b-2 pb-0.5 text-sm transition-colors',
          isActive
            ? 'border-[--color-primary] font-medium'
            : 'border-transparent text-[--color-muted] hover:text-[--color-foreground]'
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="border-b border-[--color-border]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-[--color-primary]">
          Anvara
        </Link>

        <div className="flex items-center gap-6">
          {navLink('/marketplace', 'Marketplace')}

          {user && role === 'sponsor' && navLink('/dashboard/sponsor', 'My Campaigns')}
          {user && role === 'publisher' && navLink('/dashboard/publisher', 'My Ad Slots')}

          {isPending ? (
            <span className="text-[--color-muted]">...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[--color-muted]">
                {truncate(user.name ?? '', 24)} {role && `(${role})`}
              </span>
              <button
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/';
                      },
                    },
                  });
                }}
                className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded bg-[--color-primary] px-4 py-2 text-sm text-white hover:bg-[--color-primary-hover]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
