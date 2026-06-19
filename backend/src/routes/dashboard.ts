import { Router, Response } from 'express';
import { Lead } from '../models/Lead.js';
import { Project } from '../models/Project.js';
import { Expense } from '../models/Expense.js';
import { Invoice } from '../models/Invoice.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// GET /api/admin/dashboard-metrics (admin only — exposes lead data)
router.get('/dashboard-metrics', authMiddleware, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, newCount, contactedCount, closedCount, today, last7Days, last30Days, recentLeads] =
      await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: 'new' }),
        Lead.countDocuments({ status: 'contacted' }),
        Lead.countDocuments({ status: 'closed' }),
        Lead.countDocuments({ createdAt: { $gte: todayStart } }),
        Lead.countDocuments({ createdAt: { $gte: last7 } }),
        Lead.countDocuments({ createdAt: { $gte: last30 } }),
        Lead.find().sort({ createdAt: -1 }).limit(10).lean(),
      ]);

    res.json({
      leads: {
        total,
        today,
        last7Days,
        last30Days,
        byStatus: { new: newCount, contacted: contactedCount, closed: closedCount },
        recent: recentLeads,
      },
      activity: {
        recent: [],
        lastActivity: null,
      },
      content: {
        pendingRequests: 0,
        totalRequests: 0,
      },
    });
  } catch (err) {
    console.error('Dashboard metrics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/activity (stub — returns empty for now)
router.get('/activity', authMiddleware, async (req: AuthRequest, res: Response) => {
  res.json({ activities: [], total: 0, page: 1, limit: 20 });
});

// GET /api/admin/activity/stats (stub)
router.get('/activity/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  res.json({ total: 0, byType: {} });
});

// GET /api/admin/employee-metrics (all authenticated roles)
router.get('/employee-metrics', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [projectsTotal, expensesTotal, invoicesTotal] = await Promise.all([
      Project.countDocuments(),
      Expense.countDocuments(),
      Invoice.countDocuments(),
    ]);

    res.json({
      projects: { total: projectsTotal },
      expenses: { total: expensesTotal },
      invoices: { total: invoicesTotal },
    });
  } catch (err) {
    console.error('Employee metrics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
