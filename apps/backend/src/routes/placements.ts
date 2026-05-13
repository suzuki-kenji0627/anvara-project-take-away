import { Router, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { isEnumValue } from '../utils/helpers.js';
import { PlacementStatus } from '../db.js';
import { requireAuth, roleMiddleware, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// GET /api/placements - List placements scoped to the authenticated user
// Sponsors see placements for their own campaigns; publishers see placements for their own ad slots
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.role) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const { status } = req.query;

    const placements = await prisma.placement.findMany({
      where: {
        ...(req.user.role === 'SPONSOR' && { campaign: { sponsorId: req.user.sponsorId } }),
        ...(req.user.role === 'PUBLISHER' && { publisherId: req.user.publisherId }),
        ...(isEnumValue(status, PlacementStatus) && { status }),
      },
      include: {
        campaign: { select: { id: true, name: true } },
        creative: { select: { id: true, name: true, type: true } },
        adSlot: { select: { id: true, name: true, type: true } },
        publisher: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(placements);
  } catch (error) {
    console.error('Error fetching placements:', error);
    res.status(500).json({ error: 'Failed to fetch placements' });
  }
});

// POST /api/placements - Create new placement (sponsors only)
// publisherId is derived from the ad slot — never trusted from the client
router.post('/', requireAuth, roleMiddleware(['SPONSOR']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sponsorId = req.user?.sponsorId;
    if (!sponsorId) {
      res.status(403).json({ error: 'Sponsor profile not found' });
      return;
    }

    const { campaignId, creativeId, adSlotId, agreedPrice, pricingModel, startDate, endDate } = req.body;

    if (!campaignId || !creativeId || !adSlotId || !agreedPrice) {
      res.status(400).json({
        error: 'campaignId, creativeId, adSlotId, and agreedPrice are required',
      });
      return;
    }

    // Verify the campaign belongs to the authenticated sponsor
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { sponsorId: true },
    });

    if (!campaign || campaign.sponsorId !== sponsorId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Derive publisherId from the ad slot — not from client-provided data
    const adSlot = await prisma.adSlot.findUnique({
      where: { id: adSlotId },
      select: { publisherId: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    const placement = await prisma.placement.create({
      data: {
        campaignId,
        creativeId,
        adSlotId,
        publisherId: adSlot.publisherId,
        agreedPrice,
        pricingModel: pricingModel || 'CPM',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: {
        campaign: { select: { name: true } },
        publisher: { select: { name: true } },
      },
    });

    res.status(201).json(placement);
  } catch (error) {
    console.error('Error creating placement:', error);
    res.status(500).json({ error: 'Failed to create placement' });
  }
});

export default router;
