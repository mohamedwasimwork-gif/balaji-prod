import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export function webhookAuth(req: Request, res: Response, next: NextFunction) {
  const expected = config.WEBHOOK_SECRET;
  // Skip validation if WEBHOOK_SECRET not configured (dev mode)
  if (!expected) return next();

  const secret = req.headers['x-webhook-secret'] as string;
  if (secret !== expected) {
    return res.status(403).json({ message: 'Forbidden: invalid webhook secret' });
  }
  next();
}
