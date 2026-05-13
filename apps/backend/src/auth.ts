import { type Request, type Response, type NextFunction } from 'express';
import { betterAuth } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Pool } from 'pg';
import { prisma } from './db.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const auth = betterAuth({
  database: new Pool({ connectionString }),
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-dev',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3847',
  emailAndPassword: { enabled: true },
  advanced: { disableCSRFCheck: true },
});

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: 'SPONSOR' | 'PUBLISHER';
    sponsorId?: string;
    publisherId?: string;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id, email } = session.user;

    // parallel calls, to reduce latency
    const [sponsor, publisher] = await Promise.all([
      prisma.sponsor.findUnique({ where: { userId: id }, select: { id: true } }),
      prisma.publisher.findUnique({ where: { userId: id }, select: { id: true } }),
    ]);

    if (sponsor) {
      req.user = { id, email, role: 'SPONSOR', sponsorId: sponsor.id };
    } else if (publisher) {
      req.user = { id, email, role: 'PUBLISHER', publisherId: publisher.id };
    } else {
      req.user = { id, email };
    }

    next();
  } catch (err) {
    console.error('[requireAuth] Auth check failed:', err);
    res.status(500).json({ error: 'Authentication service unavailable' });
  }
}

export function roleMiddleware(allowedRoles: Array<'SPONSOR' | 'PUBLISHER'>): (req: AuthRequest, res: Response, next: NextFunction) => void {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
