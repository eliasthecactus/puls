import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

router.get('/streak', async (req: Request, res: Response): Promise<void> => {
  const history = await prisma.workoutHistory.findMany({
    where: { userId: req.user!.id },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
  });

  const streak = calculateStreak(history.map((h) => h.completedAt));
  res.json({ streak, totalWorkouts: history.length });
});

router.put('/profile', async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({ displayName: z.string().min(1).max(64) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { displayName: parsed.data.displayName },
  });

  res.json({ id: user.id, username: user.username, displayName: user.displayName });
});

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = [
    ...new Set(
      dates.map((d) => {
        const day = new Date(d);
        day.setHours(0, 0, 0, 0);
        return day.getTime();
      }),
    ),
  ].sort((a, b) => b - a);

  const todayMs = today.getTime();
  const yesterdayMs = todayMs - 86400000;

  if (uniqueDays[0] !== todayMs && uniqueDays[0] !== yesterdayMs) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = uniqueDays[i - 1] - uniqueDays[i];
    if (diff === 86400000) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default router;
