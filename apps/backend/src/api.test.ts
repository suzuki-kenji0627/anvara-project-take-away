import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import type { Response, NextFunction } from 'express';
import { Decimal } from '@prisma/client/runtime/client';
import type { Campaign } from './db.js';
import { CampaignStatus } from './db.js';
import type { AuthRequest } from './auth.js';

vi.mock('./db.js', async () => {
  // enums.ts is generated, has no side effects, and is explicitly safe to import directly.
  // This avoids duplicating enum values and ensures tests break if the schema changes.
  const enums = await import('./generated/prisma/enums.js');
  return {
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
    ...enums,
  };
});

// auth.ts throws on import when DATABASE_URL is unset.
// vi.mock replaces the entire module so the real file never executes.
vi.mock('./auth.js', () => ({
  requireAuth: vi.fn((req: AuthRequest, _res: Response, next: NextFunction) => {
    req.user = { id: 'u1', email: 'sponsor@example.com', role: 'SPONSOR', sponsorId: 'sponsor-1' };
    next();
  }),
  roleMiddleware: vi.fn(() => (_req: AuthRequest, _res: Response, next: NextFunction) => next()),
}));

import app from './index.js';
import { prisma } from './db.js';
import { requireAuth } from './auth.js';

// ---------------------------------------------------------------------------
// Fixture factory — mirrors the pattern used in routes/campaigns.test.ts
// ---------------------------------------------------------------------------
function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'camp-default',
    name: 'Default Campaign',
    description: null,
    sponsorId: 'sponsor-1',
    budget: new Decimal(5000),
    spent: new Decimal(0),
    cpmRate: null,
    cpcRate: null,
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-12-31'),
    targetCategories: [],
    targetRegions: [],
    status: CampaignStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }] as never);
  vi.mocked(prisma.campaign.findMany).mockResolvedValue([]);
  vi.mocked(prisma.adSlot.findMany).mockResolvedValue([]);
  vi.mocked(requireAuth).mockImplementation((req, _res, next) => {
    req.user = { id: 'u1', email: 'sponsor@example.com', role: 'SPONSOR', sponsorId: 'sponsor-1' };
    next();
  });
});

describe('Sponsorships API', () => {
  describe('GET /api/sponsorships', () => {
    it('returns an array of sponsorships', async () => {
      const res = await request(app).get('/api/campaigns');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('sponsorships have required fields', async () => {
      vi.mocked(prisma.campaign.findMany).mockResolvedValueOnce([
        makeCampaign({ id: 'camp-1', name: 'Summer Campaign', status: CampaignStatus.ACTIVE }),
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
      vi.mocked(prisma.campaign.findUnique).mockResolvedValueOnce(
        makeCampaign({ id: 'camp-1', name: 'Summer Campaign' })
      );

      const res = await request(app).get('/api/campaigns/camp-1');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('camp-1');
      expect(res.body.name).toBe('Summer Campaign');
    });

    it('returns 404 for non-existent sponsorship', async () => {
      vi.mocked(prisma.campaign.findUnique).mockResolvedValueOnce(null);

      const res = await request(app).get('/api/campaigns/ghost');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sponsorships', () => {
    it('creates a new sponsorship', async () => {
      vi.mocked(prisma.campaign.create).mockResolvedValueOnce(
        makeCampaign({ id: 'camp-new', name: 'Launch Campaign', budget: new Decimal(10000) })
      );

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
      const existing = makeCampaign({ id: 'camp-1', name: 'Old Name' });
      vi.mocked(prisma.campaign.findUnique).mockResolvedValueOnce(existing);
      vi.mocked(prisma.campaign.update).mockResolvedValueOnce({ ...existing, name: 'Updated Name' });

      const res = await request(app).put('/api/campaigns/camp-1').send({ name: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    });

    it('returns 404 for non-existent sponsorship', async () => {
      vi.mocked(prisma.campaign.findUnique).mockResolvedValueOnce(null);

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

describe('GET /api/health — error path', () => {
  it('returns 503 when the database query fails', async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error('connection refused'));
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('error');
    expect(res.body.database).toBe('disconnected');
  });
});

describe('GET /api/campaigns — auth enforcement', () => {
  it('returns 401 when the session is invalid', async () => {
    vi.mocked(requireAuth).mockImplementationOnce((_req, res) => {
      res.status(401).json({ error: 'Unauthorized' });
    });
    const res = await request(app).get('/api/campaigns');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });
});
