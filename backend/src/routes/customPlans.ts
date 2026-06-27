import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

const sectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  rounds: z.number().int().min(1).max(20),
  restBetweenRounds: z.number().int().min(0).max(600).default(60),
  restAfterSection: z.number().int().min(0).max(600).default(0),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    duration: z.number().int().min(5).max(600),
  })),
});

const planSchema = z.object({
  name: z.string().min(1).max(100),
  sections: z.array(sectionSchema).min(1),
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const plans = await prisma.customPlan.findMany({
    where: { userId: req.user!.id },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(plans);
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = planSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const plan = await prisma.customPlan.create({
    data: { userId: req.user!.id, name: parsed.data.name, sections: parsed.data.sections as any },
  });
  res.status(201).json(plan);
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  const existing = await prisma.customPlan.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
  const parsed = planSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const plan = await prisma.customPlan.update({
    where: { id: req.params.id },
    data: { ...parsed.data, sections: parsed.data.sections as any },
  });
  res.json(plan);
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const existing = await prisma.customPlan.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) { res.status(404).json({ error: 'Not found' }); return; }
  await prisma.customPlan.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
