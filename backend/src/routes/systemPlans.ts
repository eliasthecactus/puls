import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/admin';
import { z } from 'zod';

const router = Router();

const refSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  rounds: z.number().int().min(1).max(20),
  restBetweenRounds: z.number().int().min(0).max(600).default(60),
  restAfterSection: z.number().int().min(0).max(600).default(0),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    duration: z.number().int().min(5).max(600),
  })).min(1),
});

const planSchema = z.object({
  planetKey: z.string().min(1).max(64),
  subtitle: z.string().max(200).default(''),
  category: z.string().min(1).max(64),
  sections: z.array(refSectionSchema).min(1),
});

// Public — list all system plans (ordered by planet key for stable display)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const plans = await prisma.systemPlan.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(plans);
});

// Admin — create system plan
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = planSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const exists = await prisma.systemPlan.findUnique({ where: { planetKey: parsed.data.planetKey } });
  if (exists) { res.status(409).json({ error: 'planetKey already in use' }); return; }
  const plan = await prisma.systemPlan.create({
    data: {
      planetKey: parsed.data.planetKey,
      subtitle: parsed.data.subtitle,
      category: parsed.data.category,
      sections: parsed.data.sections as any,
    },
  });
  res.status(201).json(plan);
});

// Admin — update system plan
router.patch('/:id', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = planSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  // Guard planetKey uniqueness when renaming
  if (parsed.data.planetKey) {
    const clash = await prisma.systemPlan.findFirst({
      where: { planetKey: parsed.data.planetKey, NOT: { id: req.params.id } },
    });
    if (clash) { res.status(409).json({ error: 'planetKey already in use' }); return; }
  }
  const plan = await prisma.systemPlan.update({
    where: { id: req.params.id },
    data: { ...parsed.data, sections: parsed.data.sections as any },
  });
  res.json(plan);
});

// Admin — delete system plan
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  await prisma.systemPlan.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
