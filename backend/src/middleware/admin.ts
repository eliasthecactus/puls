import { Request, Response, NextFunction } from 'express';

// Admins are named in ADMIN_USERNAMES (comma-separated). It used to be whoever
// held the username "elias", so on any instance where nobody had registered that
// name yet, the first stranger to do so became admin.
export function adminUsernames(): Set<string> {
  return new Set(
    (process.env.ADMIN_USERNAMES ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || !adminUsernames().has(req.user.username)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
}
