import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// vi.mock calls are hoisted above all imports by Vitest's ESM runtime.
// When index.ts loads, its transitive deps already use these mocks.

vi.mock('./db.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    campaign: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    adSlot: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
    },
    sponsor: { findUnique: vi.fn().mockResolvedValue(null) },
    publisher: { findUnique: vi.fn().mockResolvedValue(null) },
  },
  CampaignStatus: { ACTIVE: 'ACTIVE', DRAFT: 'DRAFT', PAUSED: 'PAUSED', COMPLETED: 'COMPLETED' },
  AdSlotType: { DISPLAY: 'DISPLAY', VIDEO: 'VIDEO', NATIVE: 'NATIVE', NEWSLETTER: 'NEWSLETTER', PODCAST: 'PODCAST' },
}));

// auth.ts throws on import if DATABASE_URL is unset.
// vi.mock prevents the real module from loading entirely.
vi.mock('./auth.js', () => ({
  requireAuth: vi.fn((req: any, _res: unknown, next: () => void) => {
    // Default: authenticated as sponsor. Override per test when needed.
    req.user = { id: 'u1', email: 'sponsor@example.com', role: 'SPONSOR', sponsorId: 'sponsor-1' };
    next();
  }),
  roleMiddleware: vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()),
}));

import app from './index.js';
import { prisma } from './db.js';
import { requireAuth } from './auth.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;
const mockRequireAuth = requireAuth as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  db.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);
  db.campaign.findMany.mockResolvedValue([]);
  db.adSlot.findMany.mockResolvedValue([]);
  mockRequireAuth.mockImplementation((req: any, _: unknown, next: () => void) => {
    req.user = { id: 'u1', email: 'sponsor@example.com', role: 'SPONSOR', sponsorId: 'sponsor-1' };
    next();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Existing describe blocks from the stub — todos implemented
// ─────────────────────────────────────────────────────────────────────────────

describe('Sponsorships API', () => {
  // "Sponsorship" ≈ Campaign in this codebase. Real endpoint: /api/campaigns.
  // Individual routes are tested in depth in src/routes/campaigns.test.ts.
  // These tests verify behaviour through the full app (rate limiting, CORS, etc.).

  describe('GET /api/sponsorships', () => {
    it('returns an array of sponsorships', async () => {
      const res = await request(app).get('/api/campaigns');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('sponsorships have required fields', async () => {
      db.campaign.findMany.mockResolvedValueOnce([
        {
          id: 'camp-1',
          name: 'Summer Campaign',
          budget: '5000.00',
          spent: '0.00',
          status: 'ACTIVE',
          startDate: new Date('2026-07-01').toISOString(),
          endDate: new Date('2026-08-31').toISOString(),
          sponsorId: 'sponsor-1',
          sponsor: { id: 'sponsor-1', name: 'Acme Corp', logo: null },
          _count: { creatives: 0, placements: 0 },
        },
      ]);

      const res = await request(app).get('/api/campaigns');
      expect(res.status).toBe(200);
      expect(res.body[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        status: expect.any(String),
      });
    });
  });

  describe('GET /api/sponsorships/:id', () => {
    it('returns a single sponsorship by ID', async () => {
      db.campaign.findUnique.mockResolvedValueOnce({
        id: 'camp-1',
        name: 'Summer Campaign',
        budget: '5000.00',
        spent: '0.00',
        status: 'ACTIVE',
        sponsorId: 'sponsor-1',
        sponsor: { id: 'sponsor-1' },
        creatives: [],
        placements: [],
      });

      const res = await request(app).get('/api/campaigns/camp-1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('camp-1');
      expect(res.body.name).toBe('Summer Campaign');
    });

    it('returns 404 for non-existent sponsorship', async () => {
      db.campaign.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).get('/api/campaigns/ghost');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sponsorships', () => {
    it('creates a new sponsorship', async () => {
      db.campaign.create.mockResolvedValueOnce({
        id: 'camp-new',
        name: 'Launch Campaign',
        budget: '10000.00',
        spent: '0.00',
        status: 'DRAFT',
        startDate: new Date('2026-07-01').toISOString(),
        endDate: new Date('2026-09-30').toISOString(),
        sponsorId: 'sponsor-1',
        sponsor: { id: 'sponsor-1', name: 'Acme Corp' },
      });

      const res = await request(app)
        .post('/api/campaigns')
        .send({ name: 'Launch Campaign', budget: 10000, startDate: '2026-07-01', endDate: '2026-09-30' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Launch Campaign');
      expect(res.body.sponsorId).toBe('sponsor-1');
    });

    it('returns 400 for missing required fields', async () => {
      const res = await request(app).post('/api/campaigns').send({ name: 'Incomplete' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/required/i);
    });
  });

  describe('PUT /api/sponsorships/:id', () => {
    it('updates an existing sponsorship', async () => {
      const existing = { id: 'camp-1', name: 'Old Name', sponsorId: 'sponsor-1' };
      const updated = { ...existing, name: 'Updated Name' };
      db.campaign.findUnique.mockResolvedValueOnce(existing);
      db.campaign.update.mockResolvedValueOnce(updated);

      const res = await request(app).put('/api/campaigns/camp-1').send({ name: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    });

    it('returns 404 for non-existent sponsorship', async () => {
      db.campaign.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).put('/api/campaigns/ghost').send({ name: 'Ghost' });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.database).toBe('connected');
      expect(typeof res.body.timestamp).toBe('string');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Additional coverage
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/health — error path', () => {
  it('returns 503 when the database query fails', async () => {
    db.$queryRaw.mockRejectedValueOnce(new Error('connection refused'));
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('error');
    expect(res.body.database).toBe('disconnected');
  });
});

describe('GET /api/campaigns — auth enforcement', () => {
  it('returns 401 when the session is invalid', async () => {
    mockRequireAuth.mockImplementationOnce(
      (_req: unknown, res: { status: (n: number) => { json: (b: unknown) => void } }) => {
        res.status(401).json({ error: 'Unauthorized' });
      }
    );
    const res = await request(app).get('/api/campaigns');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });
});
