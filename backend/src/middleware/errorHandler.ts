import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error & { code?: number }, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled error:', err.message, err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  res.status(500).json({ message: 'Internal server error' });
}
