import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/admin';
import { z } from 'zod';

const router = Router();

// Public — list all system plans ordered by sortOrder
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const plans = await prisma.systemPlan.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(plans);
});

const planBodySchema = z.object({
  name: z.record(z.string()),
  subtitle: z.record(z.string()),
  category: z.string().min(1),
  duration: z.number().int().min(1),
  icon: z.string().min(1),
  color: z.array(z.string()).length(2),
  sections: z.array(z.any()),
  sortOrder: z.number().int().optional(),
});

// Admin — create system plan
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = planBodySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const maxOrder = await prisma.systemPlan.aggregate({ _max: { sortOrder: true } });
  const plan = await prisma.systemPlan.create({
    data: {
      planKey: `custom-${Date.now()}`,
      name: parsed.data.name,
      subtitle: parsed.data.subtitle,
      category: parsed.data.category,
      duration: parsed.data.duration,
      icon: parsed.data.icon,
      color: parsed.data.color,
      sections: parsed.data.sections,
      sortOrder: parsed.data.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });
  res.status(201).json(plan);
});

// Admin — update system plan
router.patch('/:id', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = planBodySchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const plan = await prisma.systemPlan.update({
    where: { id: req.params.id },
    data: parsed.data as any,
  });
  res.json(plan);
});

// Admin — delete system plan
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  await prisma.systemPlan.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
