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

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id, email } = session.user;

  const sponsor = await prisma.sponsor.findUnique({
    where: { userId: id },
    select: { id: true },
  });

  if (sponsor) {
    req.user = { id, email, role: 'SPONSOR', sponsorId: sponsor.id };
    next();
    return;
  }

  const publisher = await prisma.publisher.findUnique({
    where: { userId: id },
    select: { id: true },
  });

  if (publisher) {
    req.user = { id, email, role: 'PUBLISHER', publisherId: publisher.id };
    next();
    return;
  }

  req.user = { id, email };
  next();
}

export function roleMiddleware(allowedRoles: Array<'SPONSOR' | 'PUBLISHER'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
