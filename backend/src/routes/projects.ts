import { Router, Response } from 'express';
import { Project } from '../models/Project.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { createProjectValidation, updateProjectValidation } from '../validators/projects.js';
import { handleValidation } from '../validators/shared.js';

const router = Router();
router.use(authMiddleware);

// GET /admin/projects
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, page = '1', limit: rawLimit = '20' } = req.query;
    const limit = Math.min(Math.max(Number(rawLimit) || 20, 1), 100);
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { projectTitle: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Math.max(Number(page), 1) - 1) * limit;
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ]);
    res.json({ projects, total, page: Math.max(Number(page), 1), limit });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/projects/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /admin/projects
router.post('/', createProjectValidation, handleValidation, async (req: AuthRequest, res: Response) => {
  try {
    const { projectTitle, companyName, clientName, phoneNumber, email, gstNumber, address, status } = req.body;
    const project = await Project.create({
      projectTitle,
      companyName,
      clientName,
      phoneNumber,
      email,
      gstNumber,
      address,
      status: status || 'active',
      createdBy: req.user!.id,
      updatedBy: req.user!.id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /admin/projects/:id
router.put('/:id', requireRole('admin'), updateProjectValidation, handleValidation, async (req: AuthRequest, res: Response) => {
  try {
    const { projectTitle, companyName, clientName, phoneNumber, email, gstNumber, address, status } = req.body;
    const update: Record<string, unknown> = { updatedBy: req.user!.id };
    if (projectTitle !== undefined) update.projectTitle = projectTitle;
    if (companyName !== undefined) update.companyName = companyName;
    if (clientName !== undefined) update.clientName = clientName;
    if (phoneNumber !== undefined) update.phoneNumber = phoneNumber;
    if (email !== undefined) update.email = email;
    if (gstNumber !== undefined) update.gstNumber = gstNumber;
    if (address !== undefined) update.address = address;
    if (status !== undefined) update.status = status;

    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /admin/projects/:id
router.delete('/:id', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
