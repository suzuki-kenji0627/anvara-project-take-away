import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Nav } from './components/nav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Anvara — Sponsorship Marketplace',
    template: '%s | Anvara',
  },
  description: 'The sponsorship marketplace connecting sponsors with publishers. Browse ad slots, create campaigns, and grow your audience.',
  openGraph: {
    title: 'Anvara — Sponsorship Marketplace',
    description: 'The sponsorship marketplace connecting sponsors with publishers.',
    type: 'website',
    siteName: 'Anvara',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara — Sponsorship Marketplace',
    description: 'The sponsorship marketplace connecting sponsors with publishers.',
  },
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
