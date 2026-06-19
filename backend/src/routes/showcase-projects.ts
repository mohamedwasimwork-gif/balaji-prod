import { Router, Request, Response } from 'express';
import { ShowcaseProject } from '../models/ShowcaseProject.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Public: list showcase projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, status, category, limit = '50', page = '1' } = req.query;
    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      ShowcaseProject.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      ShowcaseProject.countDocuments(filter),
    ]);
    res.json({ projects, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: get single published project by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const project = await ShowcaseProject.findOne({ slug: req.params.slug, status: 'published' });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: get single
router.get('/admin/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await ShowcaseProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create
router.post('/admin', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, client, location, category, projectDate, overview, imageUrl, images, scopeOfWork, keyHighlights, status, isFeatured, order } = req.body;
    const project = await ShowcaseProject.create({ title, slug, client, location, category, projectDate, overview, imageUrl, images, scopeOfWork, keyHighlights, status, isFeatured, order });
    res.status(201).json(project);
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ message: 'Slug already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update
router.put('/admin/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, slug, client, location, category, projectDate, overview, imageUrl, images, scopeOfWork, keyHighlights, status, isFeatured, order } = req.body;
    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (slug !== undefined) update.slug = slug;
    if (client !== undefined) update.client = client;
    if (location !== undefined) update.location = location;
    if (category !== undefined) update.category = category;
    if (projectDate !== undefined) update.projectDate = projectDate;
    if (overview !== undefined) update.overview = overview;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (images !== undefined) update.images = images;
    if (scopeOfWork !== undefined) update.scopeOfWork = scopeOfWork;
    if (keyHighlights !== undefined) update.keyHighlights = keyHighlights;
    if (status !== undefined) update.status = status;
    if (isFeatured !== undefined) update.isFeatured = isFeatured;
    if (order !== undefined) update.order = order;

    const project = await ShowcaseProject.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ message: 'Slug already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete
router.delete('/admin/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const project = await ShowcaseProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
