import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import type { Response, NextFunction } from 'express';
import { Decimal } from '@prisma/client/runtime/client';
import type { AdSlot } from '../db.js';
import { AdSlotType } from '../db.js';
import type { AuthRequest } from '../auth.js';

// ---------------------------------------------------------------------------
// Fixture factory — provides all required AdSlot fields with sensible
// defaults so tests only specify what they actually care about.
// ---------------------------------------------------------------------------
function makeAdSlot(overrides: Partial<AdSlot> = {}): AdSlot {
  return {
    id: 'slot-default',
    name: 'Default Ad Slot',
    description: null,
    publisherId: 'publisher-1',
    type: AdSlotType.DISPLAY,
    position: null,
    width: null,
    height: null,
    basePrice: new Decimal(500),
    cpmFloor: null,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Auth mock
// ---------------------------------------------------------------------------
const mockAuth = vi.hoisted(() => ({
  user: null as null | {
    id: string;
    email: string;
    role: 'SPONSOR' | 'PUBLISHER';
    sponsorId?: string;
    publisherId?: string;
  },
}));

vi.mock('../auth.js', () => ({
  requireAuth: (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!mockAuth.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    req.user = mockAuth.user;
    next();
  },
  roleMiddleware: (roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  },
}));

vi.mock('../db.js', () => ({
  prisma: {
    adSlot: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  AdSlotType: { DISPLAY: 'DISPLAY', VIDEO: 'VIDEO', NATIVE: 'NATIVE', NEWSLETTER: 'NEWSLETTER', PODCAST: 'PODCAST' },
}));

const { prisma } = await import('../db.js');
const adSlotsRouter = (await import('./adSlots.js')).default;

const app = express();
app.use(express.json());
app.use('/api/ad-slots', adSlotsRouter);

const PUBLISHER_USER = {
  id: 'user-1',
  email: 'publisher@test.com',
  role: 'PUBLISHER' as const,
  publisherId: 'publisher-1',
};

const SPONSOR_USER = {
  id: 'user-2',
  email: 'sponsor@test.com',
  role: 'SPONSOR' as const,
  sponsorId: 'sponsor-1',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAuth.user = PUBLISHER_USER;
});

describe('GET /api/ad-slots', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.user = null;
    const res = await request(app).get('/api/ad-slots');
    expect(res.status).toBe(401);
  });

  it('returns 403 for a sponsor', async () => {
    mockAuth.user = SPONSOR_USER;
    const res = await request(app).get('/api/ad-slots');
    expect(res.status).toBe(403);
  });

  it("returns only the authenticated publisher's ad slots", async () => {
    const slots = [makeAdSlot({ id: 'slot-1', name: 'Banner', publisherId: 'publisher-1' })];
    vi.mocked(prisma.adSlot.findMany).mockResolvedValue(slots);

    const res = await request(app).get('/api/ad-slots');
    expect(res.status).toBe(200);
    expect(vi.mocked(prisma.adSlot.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ publisherId: 'publisher-1' }) })
    );
  });
});

describe('GET /api/ad-slots/available', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.user = null;
    const res = await request(app).get('/api/ad-slots/available');
    expect(res.status).toBe(401);
  });

  it('returns all available slots for a sponsor', async () => {
    mockAuth.user = SPONSOR_USER;
    const slots = [
      makeAdSlot({ id: 'slot-1', publisherId: 'publisher-1' }),
      makeAdSlot({ id: 'slot-2', publisherId: 'publisher-2' }),
    ];
    vi.mocked(prisma.adSlot.findMany).mockResolvedValue(slots);

    const res = await request(app).get('/api/ad-slots/available');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(vi.mocked(prisma.adSlot.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isAvailable: true } })
    );
  });

  it("returns only own available slots for a publisher", async () => {
    const slots = [makeAdSlot({ id: 'slot-1', publisherId: 'publisher-1' })];
    vi.mocked(prisma.adSlot.findMany).mockResolvedValue(slots);

    const res = await request(app).get('/api/ad-slots/available');
    expect(res.status).toBe(200);
    expect(vi.mocked(prisma.adSlot.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isAvailable: true, publisherId: 'publisher-1' } })
    );
  });
});

describe('GET /api/ad-slots/:id', () => {
  it('returns 404 when the ad slot does not exist', async () => {
    vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(null);
    const res = await request(app).get('/api/ad-slots/missing');
    expect(res.status).toBe(404);
  });

  it("returns 403 when a publisher accesses another publisher's slot", async () => {
    vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(makeAdSlot({ id: 'slot-1', publisherId: 'other-publisher' }));
    const res = await request(app).get('/api/ad-slots/slot-1');
    expect(res.status).toBe(403);
  });

  it("returns the slot when a publisher accesses their own", async () => {
    vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(makeAdSlot({ id: 'slot-1', publisherId: 'publisher-1' }));
    const res = await request(app).get('/api/ad-slots/slot-1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('slot-1');
  });

  it('returns the slot when a sponsor accesses any slot', async () => {
    mockAuth.user = SPONSOR_USER;
    vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(makeAdSlot({ id: 'slot-1', publisherId: 'any-publisher' }));
    const res = await request(app).get('/api/ad-slots/slot-1');
    expect(res.status).toBe(200);
  });
});

describe('POST /api/ad-slots', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.user = null;
    const res = await request(app).post('/api/ad-slots').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  it('returns 403 for a sponsor', async () => {
    mockAuth.user = SPONSOR_USER;
    const res = await request(app).post('/api/ad-slots').send({ name: 'Test', type: 'DISPLAY', basePrice: 100 });
    expect(res.status).toBe(403);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/ad-slots').send({ name: 'No type or price' });
    expect(res.status).toBe(400);
  });

  it('creates and returns an ad slot with status 201', async () => {
    const payload = { name: 'Header Banner', type: 'DISPLAY', basePrice: 500 };
    vi.mocked(prisma.adSlot.create).mockResolvedValue(makeAdSlot({ id: 'slot-new', publisherId: 'publisher-1' }));

    const res = await request(app).post('/api/ad-slots').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('slot-new');
    expect(res.body.publisherId).toBe('publisher-1');
  });
});

describe('DELETE /api/ad-slots/:id', () => {
  it('returns 404 when ad slot does not exist', async () => {
    vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(null);
    const res = await request(app).delete('/api/ad-slots/missing');
    expect(res.status).toBe(404);
  });

  it("returns 403 when slot belongs to a different publisher", async () => {
    vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(makeAdSlot({ id: 'slot-1', publisherId: 'other-publisher' }));
    const res = await request(app).delete('/api/ad-slots/slot-1');
    expect(res.status).toBe(403);
  });

  it('deletes the slot and returns 204', async () => {
    vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(makeAdSlot({ id: 'slot-1', publisherId: 'publisher-1' }));
    vi.mocked(prisma.adSlot.delete).mockResolvedValue(makeAdSlot({ id: 'slot-1' }));

    const res = await request(app).delete('/api/ad-slots/slot-1');
    expect(res.status).toBe(204);
    expect(vi.mocked(prisma.adSlot.delete)).toHaveBeenCalledWith({ where: { id: 'slot-1' } });
  });
});
