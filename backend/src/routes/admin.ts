import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/admin';

const router = Router();
router.use(authenticate, requireAdmin);

// List all users with stats
router.get('/users', async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { credentials: true, history: true } },
    },
  });
  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    lastActiveAt: u.lastActiveAt,
    createdAt: u.createdAt,
    credentialCount: u._count.credentials,
    workoutCount: u._count.history,
  })));
});

// Delete user
router.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  if (req.params.id === req.user!.id) { res.status(400).json({ error: 'Cannot delete yourself' }); return; }
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Generate passkey reset token (valid 48 hours)
router.post('/users/:id/reset-token', async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  // Invalidate old unused tokens for this user
  await prisma.passkeyResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });

  const token = await prisma.passkeyResetToken.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  });

  const origin = process.env.ORIGIN || 'http://localhost';
  res.json({ token: token.token, url: `${origin}/reset?token=${token.token}`, expiresAt: token.expiresAt });
});

export default router;
