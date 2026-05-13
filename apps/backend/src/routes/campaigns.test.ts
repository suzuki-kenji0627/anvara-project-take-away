import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// vi.hoisted ensures this object exists before vi.mock factories run
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
  requireAuth: (req: any, res: any, next: any) => {
    if (!mockAuth.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    req.user = mockAuth.user;
    next();
  },
  roleMiddleware: (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  },
}));

vi.mock('../db.js', () => ({
  prisma: {
    campaign: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const { prisma } = await import('../db.js');
const campaignsRouter = (await import('./campaigns.js')).default;

const app = express();
app.use(express.json());
app.use('/api/campaigns', campaignsRouter);

const SPONSOR_USER = {
  id: 'user-1',
  email: 'sponsor@test.com',
  role: 'SPONSOR' as const,
  sponsorId: 'sponsor-1',
};

const PUBLISHER_USER = {
  id: 'user-2',
  email: 'publisher@test.com',
  role: 'PUBLISHER' as const,
  publisherId: 'publisher-1',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockAuth.user = SPONSOR_USER;
});

describe('GET /api/campaigns', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.user = null;
    const res = await request(app).get('/api/campaigns');
    expect(res.status).toBe(401);
  });

  it('returns 403 for a publisher', async () => {
    mockAuth.user = PUBLISHER_USER;
    const res = await request(app).get('/api/campaigns');
    expect(res.status).toBe(403);
  });

  it('returns only the authenticated sponsor\'s campaigns', async () => {
    const campaigns = [{ id: 'c-1', name: 'Campaign A', sponsorId: 'sponsor-1' }];
    vi.mocked(prisma.campaign.findMany).mockResolvedValue(campaigns as any);

    const res = await request(app).get('/api/campaigns');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(campaigns);
    expect(vi.mocked(prisma.campaign.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ sponsorId: 'sponsor-1' }) })
    );
  });
});

describe('GET /api/campaigns/:id', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.user = null;
    const res = await request(app).get('/api/campaigns/c-1');
    expect(res.status).toBe(401);
  });

  it('returns 404 when campaign does not exist', async () => {
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue(null);
    const res = await request(app).get('/api/campaigns/missing');
    expect(res.status).toBe(404);
  });

  it('returns 403 when campaign belongs to a different sponsor', async () => {
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: 'c-1',
      sponsorId: 'other-sponsor',
    } as any);
    const res = await request(app).get('/api/campaigns/c-1');
    expect(res.status).toBe(403);
  });

  it('returns the campaign when it belongs to the authenticated sponsor', async () => {
    const campaign = { id: 'c-1', name: 'My Campaign', sponsorId: 'sponsor-1' };
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue(campaign as any);

    const res = await request(app).get('/api/campaigns/c-1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('c-1');
  });
});

describe('POST /api/campaigns', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.user = null;
    const res = await request(app).post('/api/campaigns').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  it('returns 403 for a publisher', async () => {
    mockAuth.user = PUBLISHER_USER;
    const res = await request(app).post('/api/campaigns').send({ name: 'Test' });
    expect(res.status).toBe(403);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/campaigns').send({ name: 'Missing dates' });
    expect(res.status).toBe(400);
  });

  it('creates and returns a campaign with status 201', async () => {
    const payload = {
      name: 'New Campaign',
      budget: 5000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    };
    const created = { id: 'c-new', ...payload, sponsorId: 'sponsor-1' };
    vi.mocked(prisma.campaign.create).mockResolvedValue(created as any);

    const res = await request(app).post('/api/campaigns').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('c-new');
    expect(res.body.sponsorId).toBe('sponsor-1');
  });
});

describe('DELETE /api/campaigns/:id', () => {
  it('returns 404 when campaign does not exist', async () => {
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue(null);
    const res = await request(app).delete('/api/campaigns/missing');
    expect(res.status).toBe(404);
  });

  it('returns 403 when campaign belongs to a different sponsor', async () => {
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: 'c-1',
      sponsorId: 'other-sponsor',
    } as any);
    const res = await request(app).delete('/api/campaigns/c-1');
    expect(res.status).toBe(403);
  });

  it('deletes the campaign and returns 204', async () => {
    vi.mocked(prisma.campaign.findUnique).mockResolvedValue({
      id: 'c-1',
      sponsorId: 'sponsor-1',
    } as any);
    vi.mocked(prisma.campaign.delete).mockResolvedValue({} as any);

    const res = await request(app).delete('/api/campaigns/c-1');
    expect(res.status).toBe(204);
    expect(vi.mocked(prisma.campaign.delete)).toHaveBeenCalledWith({ where: { id: 'c-1' } });
  });
});
