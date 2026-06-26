import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    req.session.destroy(() => {});
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  req.user = user;
  next();
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    challenge?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: import('@prisma/client').User;
    }
  }
}
