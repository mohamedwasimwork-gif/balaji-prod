import { Router, Request, Response } from 'express';
import { PageContent } from '../models/PageContent.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

const VALID_PAGES = ['home', 'solutions', 'contact', 'projects'] as const;

// Deep merge: recursively merges plain objects, replaces arrays and primitives.
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal !== null &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal !== null &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(
        tgtVal as Record<string, unknown>,
        srcVal as Record<string, unknown>
      );
    } else {
      result[key] = srcVal;
    }
  }
  return result;
}

// Public: get page content
router.get('/:page', async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    if (!VALID_PAGES.includes(page as (typeof VALID_PAGES)[number])) {
      return res.status(400).json({ message: 'Invalid page' });
    }
    const doc = await PageContent.findOne({ page });
    if (!doc) return res.json({});
    res.json(doc.data || {});
  } catch (err) {
    console.error(`[page-content] GET /${req.params.page} error:`, err);
    res.status(500).json({ message: 'Failed to fetch page content' });
  }
});

// Admin: update page content (deep merge — preserves unmodified sections)
router.put('/admin/:page', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page } = req.params;
    if (!VALID_PAGES.includes(page as (typeof VALID_PAGES)[number])) {
      return res.status(400).json({ message: 'Invalid page' });
    }
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    const existing = await PageContent.findOne({ page });
    const mergedData = deepMerge(
      (existing?.data as Record<string, unknown>) || {},
      req.body as Record<string, unknown>
    );

    const doc = await PageContent.findOneAndUpdate(
      { page },
      { $set: { data: mergedData, updatedBy: req.user!.id } },
      { upsert: true, new: true }
    );

    if (!doc) {
      return res.status(500).json({ message: 'Failed to save page content' });
    }

    res.json(doc.data);
  } catch (err) {
    console.error(`[page-content] PUT /admin/${req.params.page} error:`, err);
    res.status(500).json({ message: 'Failed to update page content' });
  }
});

export default router;
