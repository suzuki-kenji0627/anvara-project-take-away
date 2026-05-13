import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'Anvara — The Sponsorship Marketplace' },
  description:
    'Anvara connects sponsors with publishers. Browse ad slots, launch campaigns, and grow your audience through targeted sponsorships.',
  openGraph: {
    title: 'Anvara — The Sponsorship Marketplace',
    description:
      'Connect sponsors with publishers. Browse ad slots and launch targeted campaigns.',
    type: 'website',
    siteName: 'Anvara',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara — The Sponsorship Marketplace',
    description: 'Connect sponsors with publishers. Browse ad slots and launch targeted campaigns.',
  },
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

function IconCurrencyDollar() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
}

function IconChartBar() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <IconSearch />,
    title: 'Smart Discovery',
    description:
      'Browse a curated marketplace of ad slots across newsletters, podcasts, display, and video formats — filtered to match your goals.',
  },
  {
    icon: <IconCurrencyDollar />,
    title: 'Transparent Pricing',
    description:
      'Publishers set their own rates. No hidden fees, no bidding wars — see exactly what you pay before you commit.',
  },
  {
    icon: <IconChartBar />,
    title: 'Performance Analytics',
    description:
      'Track impressions, clicks, and CTR in real time. Understand what works and optimise your spend with confidence.',
  },
  {
    icon: <IconBolt />,
    title: 'One-click Booking',
    description:
      'Find the right slot and book instantly. No lengthy negotiations — go from discovery to live in minutes.',
  },
  {
    icon: <IconUsers />,
    title: 'Audience Reach',
    description:
      'Access publishers across every niche and format. Reach the exact audience you need, at the scale you want.',
  },
  {
    icon: <IconShield />,
    title: 'Verified Publishers',
    description:
      'Every publisher on Anvara is reviewed for quality. Sponsor with confidence knowing your brand is in good hands.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      "Sign up as a sponsor or publisher in minutes. Tell us who you are and what you're looking to achieve.",
  },
  {
    number: '02',
    title: 'Browse or list',
    description:
      'Sponsors browse available ad slots and filter by format, audience, and price. Publishers list their inventory and set their own rates.',
  },
  {
    number: '03',
    title: 'Connect and grow',
    description:
      'Book placements, run campaigns, and track performance — all from one dashboard. No middlemen, no delays.',
  },
];

const sponsorBenefits = [
  'Browse thousands of curated ad slots',
  'Filter by format, niche, and price',
  'Manage all campaigns in one dashboard',
  'Real-time CTR and performance tracking',
  'Book placements instantly',
];

const publisherBenefits = [
  'List ad slots across any format',
  'Set your own rates and availability',
  'Get matched with relevant sponsors',
  'Track revenue and booking history',
  'Manage everything from one place',
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="-mx-4 px-4 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[--color-border] px-4 py-1.5 text-sm text-[--color-muted]">
            <span className="h-2 w-2 rounded-full bg-[--color-secondary]" aria-hidden="true" />
            The smarter way to sponsor
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Connect Sponsors with{' '}
            <span style={{ color: 'var(--color-primary)' }}>Premium Publishers</span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-[--color-muted] sm:text-xl">
            Anvara is the sponsorship marketplace where brands find their audience and creators
            monetise their reach — transparently, efficiently, at scale.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="w-full rounded-lg bg-[--color-primary] px-8 py-3.5 font-medium text-white hover:bg-[--color-primary-hover] sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/marketplace"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[--color-border] px-8 py-3.5 font-medium hover:bg-white/5 sm:w-auto"
            >
              Browse Marketplace <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20" aria-labelledby="features-heading">
        <div className="mb-12 text-center">
          <h2 id="features-heading" className="mb-3 text-3xl font-bold">
            Everything you need to grow
          </h2>
          <p className="text-[--color-muted]">
            Purpose-built tools for sponsors and publishers to connect and succeed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-[--color-border] p-6">
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[--color-muted]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className="-mx-4 px-4 py-20"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 4%, transparent)' }}
        aria-labelledby="how-it-works-heading"
      >
        <div className="mb-12 text-center">
          <h2 id="how-it-works-heading" className="mb-3 text-3xl font-bold">
            How Anvara works
          </h2>
          <p className="text-[--color-muted]">Get up and running in three simple steps.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                {step.number}
              </div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[--color-muted]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── For Sponsors / For Publishers ── */}
      <section className="py-20" aria-labelledby="audience-heading">
        <h2 id="audience-heading" className="mb-12 text-center text-3xl font-bold">
          Built for both sides of the deal
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[--color-border] p-8">
            <h3
              className="mb-1 text-xl font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              For Sponsors
            </h3>
            <p className="mb-6 text-sm text-[--color-muted]">
              Reach your ideal audience through vetted publishers — without the agency markup.
            </p>
            <ul className="space-y-3">
              {sponsorBenefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <span style={{ color: 'var(--color-primary)' }}>
                    <IconCheck />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[--color-primary] px-5 py-2.5 text-sm font-medium text-white hover:bg-[--color-primary-hover]"
            >
              Start sponsoring <IconArrowRight />
            </Link>
          </div>

          <div className="rounded-xl border border-[--color-border] p-8">
            <h3
              className="mb-1 text-xl font-bold"
              style={{ color: 'var(--color-secondary)' }}
            >
              For Publishers
            </h3>
            <p className="mb-6 text-sm text-[--color-muted]">
              Monetise your audience on your own terms — set your rates and keep full control.
            </p>
            <ul className="space-y-3">
              {publisherBenefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm">
                  <span style={{ color: 'var(--color-secondary)' }}>
                    <IconCheck />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              List your slots <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="-mx-4 px-4 py-24 text-center"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)' }}
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-2xl">
          <h2 id="cta-heading" className="mb-4 text-4xl font-bold">
            Ready to find your perfect match?
          </h2>
          <p className="mb-8 text-lg text-[--color-muted]">
            Join sponsors and publishers already growing with Anvara. It takes minutes to get
            started.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="w-full rounded-lg bg-[--color-primary] px-8 py-3.5 font-medium text-white hover:bg-[--color-primary-hover] sm:w-auto"
            >
              Create a free account
            </Link>
            <Link
              href="/marketplace"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[--color-border] px-8 py-3.5 font-medium hover:bg-white/5 sm:w-auto"
            >
              Browse Marketplace <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
