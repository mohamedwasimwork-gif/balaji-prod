import { Router, Request, Response } from 'express';
import { Lead } from '../models/Lead.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { webhookAuth } from '../middleware/webhookAuth.js';
import { webhookLeadValidation, updateLeadValidation } from '../validators/leads.js';
import { handleValidation } from '../validators/shared.js';

const router = Router();

// ─── Public: Framer Webhook ─────────────────────────────────────────────────
// POST /api/leads/webhook/framer
// Framer form submissions hit this endpoint. Validated by webhook secret.
router.post('/webhook/framer', webhookAuth, (req: Request, _res: Response, next: Function) => {
  // Normalize Framer field names: Framer sends capitalized keys (Name, Email, Message, "Company name")
  const body = req.body;
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    normalized[key.toLowerCase().replace(/\s+/g, '_')] = value;
  }
  // Map company_name to service if service is not provided
  if (normalized.company_name && !normalized.service) {
    normalized.service = normalized.company_name;
  }
  req.body = { ...body, ...normalized };
  next();
}, webhookLeadValidation, handleValidation, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, message, formName } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone: phone || '',
      service: service || '',
      message: message || '',
      formName: formName || 'framer-contact',
      source: 'framer',
      status: 'new',
      isContacted: false,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
    });

    console.log(`📩 New Framer lead: ${name} <${email}>`);
    res.status(201).json({ success: true, leadId: lead._id });
  } catch (err) {
    console.error('Framer webhook error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Public: Generic Webhook (React site / any source) ──────────────────────
router.post('/webhook', webhookAuth, webhookLeadValidation, handleValidation, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, message, formName, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone: phone || '',
      service: service || '',
      message: message || '',
      formName: formName || 'contact',
      source: source || 'react',
      status: 'new',
      isContacted: false,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
    });

    res.status(201).json({ success: true, leadId: lead._id });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Public: Website contact form submission ─────────────────────────────────
// POST /api/leads/submit
// No webhook auth required. Rate limited separately in server.ts (5 req / 15 min).
router.post('/submit', webhookLeadValidation, handleValidation, async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, message } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone: phone || '',
      service: service || '',
      message: message || '',
      formName: 'website-contact',
      source: 'react',
      status: 'new',
      isContacted: false,
      ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || '',
      userAgent: req.headers['user-agent'] || '',
    });

    console.log(`📩 New website lead: ${name} <${email}>`);
    res.status(201).json({ success: true, leadId: lead._id });
  } catch (err) {
    console.error('Website contact form error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Stats summary ───────────────────────────────────────────────────
router.get('/stats/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, newCount, contactedCount, closedCount, today, last7Days, last30Days] =
      await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: 'new' }),
        Lead.countDocuments({ status: 'contacted' }),
        Lead.countDocuments({ status: 'closed' }),
        Lead.countDocuments({ createdAt: { $gte: todayStart } }),
        Lead.countDocuments({ createdAt: { $gte: last7 } }),
        Lead.countDocuments({ createdAt: { $gte: last30 } }),
      ]);

    res.json({
      total,
      byStatus: { new: newCount, contacted: contactedCount, closed: closedCount },
      today,
      last7Days,
      last30Days,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: List leads ──────────────────────────────────────────────────────
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, formName, limit: rawLimit = '50', page = '1' } = req.query;
    const limit = Math.min(Math.max(Number(rawLimit) || 50, 1), 100);
    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') filter.status = status;
    if (formName) filter.formName = formName;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Math.max(Number(page), 1) - 1) * limit;
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(filter),
    ]);

    res.json({ leads, total, page: Math.max(Number(page), 1), limit });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Get single lead ─────────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Update lead (status, notes) ─────────────────────────────────────
router.patch('/:id', authMiddleware, updateLeadValidation, handleValidation, async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    const update: Record<string, unknown> = {};

    if (status) {
      update.status = status;
      if (status === 'contacted') {
        update.isContacted = true;
        update.contactedAt = new Date();
        update.contactedBy = req.user!.id;
      }
    }
    if (notes !== undefined) update.notes = notes;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Admin: Delete lead ─────────────────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
