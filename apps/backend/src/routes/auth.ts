import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { requireAuth, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// NOTE: Authentication is handled by Better Auth on the frontend
// This route is kept for any backend-specific auth utilities

// POST /api/auth/login - Placeholder (Better Auth handles login via frontend)
router.post('/login', async (_req: Request, res: Response): Promise<void> => {
  res.status(400).json({
    error: 'Use the frontend login at /login instead',
    hint: 'Better Auth handles authentication via the Next.js frontend',
  });
});

// GET /api/auth/me - Get the currently authenticated user and their role
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json(req.user);
});

// GET /api/auth/role/me - Get the authenticated user's role and entity IDs.
// requireAuth already resolved sponsorId/publisherId — no extra DB calls needed.
router.get('/role/me', requireAuth, (req: AuthRequest, res: Response): void => {
  const { role, sponsorId, publisherId } = req.user!;

  if (role === 'SPONSOR') {
    res.json({ role: 'sponsor', sponsorId });
    return;
  }

  if (role === 'PUBLISHER') {
    res.json({ role: 'publisher', publisherId });
    return;
  }

  res.json({ role: null });
});

export default router;
