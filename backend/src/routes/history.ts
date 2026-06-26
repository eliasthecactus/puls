import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const history = await prisma.workoutHistory.findMany({
    where: { userId: req.user!.id },
    orderBy: { completedAt: 'desc' },
    take: 50,
  });
  res.json(history);
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    workoutId: z.string(),
    workoutName: z.string(),
    duration: z.number().int().min(0),
    intensity: z.enum(['normal', 'intense']).default('normal'),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const entry = await prisma.workoutHistory.create({
    data: { ...parsed.data, userId: req.user!.id },
  });

  res.status(201).json(entry);
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const entry = await prisma.workoutHistory.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });

  if (!entry) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  await prisma.workoutHistory.delete({ where: { id: entry.id } });
  res.status(204).send();
});

export default router;
