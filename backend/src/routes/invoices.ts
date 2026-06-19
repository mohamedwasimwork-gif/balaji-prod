import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Invoice } from '../models/Invoice.js';
import { Project } from '../models/Project.js';
import { getNextSequence } from '../models/Counter.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { createInvoiceValidation, updateInvoiceValidation } from '../validators/invoices.js';
import { handleValidation } from '../validators/shared.js';

const router = Router();
router.use(authMiddleware);

// GET /admin/invoices
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, amountType, paymentMode, search, startDate, endDate, page = '1', limit: rawLimit = '20' } = req.query;
    const limit = Math.min(Math.max(Number(rawLimit) || 20, 1), 100);
    const filter: any = {};
    if (projectId) filter.projectId = projectId;
    if (amountType) filter.amountType = amountType;
    if (paymentMode) filter.paymentMode = paymentMode;
    if (search) {
      filter.$or = [
        { invoiceId: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
        { 'projectSnapshot.projectTitle': { $regex: search, $options: 'i' } },
        { vendorName: { $regex: search, $options: 'i' } },
      ];
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }
    const skip = (Math.max(Number(page), 1) - 1) * limit;
    const [invoices, total] = await Promise.all([
      Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Invoice.countDocuments(filter),
    ]);
    res.json({ invoices, total, page: Math.max(Number(page), 1), limit });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/invoices/project/:projectId/profit — invoices-only profit by project ID
router.get('/project/:projectId/profit', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const projectId = new mongoose.Types.ObjectId(req.params.projectId);

    const agg = await Invoice.aggregate([
      { $match: { projectId } },
      {
        $group: {
          _id: null,
          totalCredit: { $sum: { $cond: [{ $eq: ['$amountType', 'credit'] }, '$amount', 0] } },
          totalDebit: { $sum: { $cond: [{ $eq: ['$amountType', 'debit'] }, '$amount', 0] } },
        },
      },
    ]);

    const totalIncome = agg[0]?.totalCredit || 0;
    const totalExpenditure = agg[0]?.totalDebit || 0;
    const profit = totalIncome - totalExpenditure;
    const profitPercentage = (() => {
      if (totalIncome === 0 && totalExpenditure === 0) return 0;
      if (totalIncome === 0) return -100;
      return (profit / totalIncome) * 100;
    })();

    res.json({
      projectId: req.params.projectId,
      totalIncome,
      totalExpenditure,
      profit,
      profitPercentage: Math.round(profitPercentage * 100) / 100,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/invoices/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/invoices/:id/profit — invoices-only profit (NO expenses)
router.get('/:id/profit', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const projectId = invoice.projectId;

    // Aggregate ONLY invoices for this project
    const invoiceAgg = await Invoice.aggregate([
      { $match: { projectId } },
      {
        $group: {
          _id: null,
          totalCredit: { $sum: { $cond: [{ $eq: ['$amountType', 'credit'] }, '$amount', 0] } },
          totalDebit: { $sum: { $cond: [{ $eq: ['$amountType', 'debit'] }, '$amount', 0] } },
        },
      },
    ]);

    const totalIncome = invoiceAgg[0]?.totalCredit || 0;
    const totalExpenditure = invoiceAgg[0]?.totalDebit || 0;
    const profit = totalIncome - totalExpenditure;
    const profitPercentage = (() => {
      if (totalIncome === 0 && totalExpenditure === 0) return 0;
      if (totalIncome === 0) return -100;
      return (profit / totalIncome) * 100;
    })();

    res.json({
      projectId,
      invoiceId: invoice.invoiceId,
      totalIncome,
      totalExpenditure,
      profit,
      profitPercentage: Math.round(profitPercentage * 100) / 100,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /admin/invoices
router.post('/', createInvoiceValidation, handleValidation, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, purpose, amount, amountType, paymentMode, refId, remarks, vendorName, invoiceNumber, gstNumber } = req.body;
    if (purpose.trim().split(/\s+/).length > 100) {
      return res.status(400).json({ message: 'Purpose must be max 100 words' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const invoiceId = await getNextSequence('invoice');
    const invoice = await Invoice.create({
      invoiceId,
      projectId,
      projectSnapshot: {
        projectTitle: project.projectTitle,
        companyName: project.companyName,
        clientName: project.clientName,
        phoneNumber: project.phoneNumber,
        email: project.email,
        address: project.address,
      },
      purpose,
      amount,
      amountType,
      paymentMode,
      refId,
      remarks,
      vendorName,
      invoiceNumber,
      gstNumber,
      createdBy: req.user!.id,
      updatedBy: req.user!.id,
    });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /admin/invoices/:id
router.put('/:id', requireRole('admin'), updateInvoiceValidation, handleValidation, async (req: AuthRequest, res: Response) => {
  try {
    const { purpose } = req.body;
    if (purpose && purpose.trim().split(/\s+/).length > 100) {
      return res.status(400).json({ message: 'Purpose must be max 100 words' });
    }
    const { purpose: p, amount, amountType, paymentMode, refId, remarks, vendorName, invoiceNumber, gstNumber } = req.body;
    const update: Record<string, unknown> = { updatedBy: req.user!.id };
    if (p !== undefined) update.purpose = p;
    if (amount !== undefined) update.amount = amount;
    if (amountType !== undefined) update.amountType = amountType;
    if (paymentMode !== undefined) update.paymentMode = paymentMode;
    if (refId !== undefined) update.refId = refId;
    if (remarks !== undefined) update.remarks = remarks;
    if (vendorName !== undefined) update.vendorName = vendorName;
    if (invoiceNumber !== undefined) update.invoiceNumber = invoiceNumber;
    if (gstNumber !== undefined) update.gstNumber = gstNumber;

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /admin/invoices/:id
router.delete('/:id', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
