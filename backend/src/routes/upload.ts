import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// POST /api/upload — admin only
router.post(
  '/',
  authMiddleware,
  (req: AuthRequest, res: Response, next) => {
    // Only admins can upload
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  },
  upload.single('file'),
  (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = req.file as Express.Multer.File & {
      path: string;
      filename: string;
    };

    res.status(201).json({
      url:      file.path,
      publicId: file.filename,
    });
  }
);

export default router;
