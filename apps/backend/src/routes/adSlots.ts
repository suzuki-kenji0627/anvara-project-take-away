import { Router, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { authMiddleware, roleMiddleware, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// GET /api/ad-slots - List ad slots
// Publishers see only their own slots; sponsors see all available slots (marketplace) as per the requirement
// TODO: However, the marketplace pages is also available to unauthenticated users, so what should we do?
// Ideally, we should have two separate routes for the marketplace:
// 1. /api/ad-slots - for authenticated users
// 2. /api/ad-slots/public - for anyone (unauthenticated users)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { type, available } = req.query;

    const adSlots = await prisma.adSlot.findMany({
      where: {
        ...(req.user?.role === 'PUBLISHER' && { publisherId: req.user.publisherId }),
        ...(type && {
          type: type as string as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST',
        }),
        ...(available === 'true' && { isAvailable: true }),
      },
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.json(adSlots);
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/:id - Get single ad slot (any authenticated user — needed for marketplace)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// POST /api/ad-slots - Create new ad slot (publishers only)
router.post('/', authMiddleware, roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, type, basePrice } = req.body;

    if (!name || !type || !basePrice) {
      res.status(400).json({
        error: 'Name, type, and basePrice are required',
      });
      return;
    }

    const adSlot = await prisma.adSlot.create({
      data: {
        name,
        description,
        type,
        basePrice,
        publisherId: req.user!.publisherId!,
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(adSlot);
  } catch (error) {
    console.error('Error creating ad slot:', error);
    res.status(500).json({ error: 'Failed to create ad slot' });
  }
});

// POST /api/ad-slots/:id/book - Book an ad slot (sponsors only)
router.post('/:id/book', authMiddleware, roleMiddleware(['SPONSOR']), async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { message } = req.body;

    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: false },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    console.log(`Ad slot ${id} booked by sponsor ${req.user!.sponsorId}. Message: ${message || 'None'}`);

    res.json({
      success: true,
      message: 'Ad slot booked successfully!',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
});

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (publishers only)
router.post('/:id/unbook', authMiddleware, roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      select: { publisherId: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (adSlot.publisherId !== req.user!.publisherId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: true },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
});

// PUT /api/ad-slots/:id - Update ad slot (publishers only)
router.put('/:id', authMiddleware, roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const existing = await prisma.adSlot.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (existing.publisherId !== req.user!.publisherId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { name, description, type, position, width, height, basePrice, cpmFloor, isAvailable } = req.body;

    const adSlot = await prisma.adSlot.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(position !== undefined && { position }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(basePrice !== undefined && { basePrice }),
        ...(cpmFloor !== undefined && { cpmFloor }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json(adSlot);
  } catch (error) {
    console.error('Error updating ad slot:', error);
    res.status(500).json({ error: 'Failed to update ad slot' });
  }
});

// DELETE /api/ad-slots/:id - Delete ad slot (publishers only)
router.delete('/:id', authMiddleware, roleMiddleware(['PUBLISHER']), async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const existing = await prisma.adSlot.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (existing.publisherId !== req.user!.publisherId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.adSlot.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ad slot:', error);
    res.status(500).json({ error: 'Failed to delete ad slot' });
  }
});

export default router;
