import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Expense } from '../models/Expense.js';
import { Project } from '../models/Project.js';
import { getNextSequence } from '../models/Counter.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { createExpenseValidation, updateExpenseValidation } from '../validators/expenses.js';
import { handleValidation } from '../validators/shared.js';

const router = Router();
router.use(authMiddleware);

// GET /admin/expenses
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
        { expenseId: { $regex: search, $options: 'i' } },
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
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Expense.countDocuments(filter),
    ]);
    res.json({ expenses, total, page: Math.max(Number(page), 1), limit });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /admin/expenses/project/:projectId/profit — expenses-only profit
router.get('/project/:projectId/profit', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const projectId = new mongoose.Types.ObjectId(req.params.projectId);

    const agg = await Expense.aggregate([
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

// GET /admin/expenses/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /admin/expenses/batch
router.post('/batch', async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, expenses } = req.body;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Valid Project ID is required' });
    }
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: 'Expenses array is required and must not be empty' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Validate all expenses
    for (let i = 0; i < expenses.length; i++) {
      const exp = expenses[i];
      const { purpose, amount, amountType, paymentMode, refId, vendorName } = exp;
      if (!purpose || typeof purpose !== 'string' || purpose.trim().length === 0) {
        return res.status(400).json({ message: `Purpose is required for expense item at index ${i + 1}` });
      }
      if (purpose.trim().split(/\s+/).length > 100) {
        return res.status(400).json({ message: `Purpose must be max 100 words for expense item at index ${i + 1}` });
      }
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: `Amount must be a positive number greater than 0 for expense item at index ${i + 1}` });
      }
      if (!['credit', 'debit'].includes(amountType)) {
        return res.status(400).json({ message: `Amount type must be credit or debit for expense item at index ${i + 1}` });
      }
      if (!['cash', 'upi', 'bank', 'other'].includes(paymentMode)) {
        return res.status(400).json({ message: `Payment mode must be cash, upi, bank, or other for expense item at index ${i + 1}` });
      }
      if (!refId || typeof refId !== 'string' || refId.trim().length === 0) {
        return res.status(400).json({ message: `Reference ID is required for expense item at index ${i + 1}` });
      }
      if (vendorName && typeof vendorName === 'string' && vendorName.trim().split(/\s+/).length > 100) {
        return res.status(400).json({ message: `Vendor Name must be max 100 words for expense item at index ${i + 1}` });
      }
    }

    const createdExpenses = [];
    for (const exp of expenses) {
      const { purpose, amount, amountType, paymentMode, refId, remarks, vendorName, invoiceNumber, gstNumber } = exp;
      const expenseId = await getNextSequence('expense');
      const newExp = await Expense.create({
        expenseId,
        projectId,
        projectSnapshot: {
          projectTitle: project.projectTitle,
          companyName: project.companyName,
          clientName: project.clientName,
          phoneNumber: project.phoneNumber,
          email: project.email,
          address: project.address,
        },
        purpose: purpose.trim(),
        amount,
        amountType,
        paymentMode,
        refId: refId.trim(),
        remarks: remarks ? remarks.trim() : undefined,
        vendorName: vendorName ? vendorName.trim() : undefined,
        invoiceNumber: invoiceNumber ? invoiceNumber.trim() : undefined,
        gstNumber: gstNumber ? gstNumber.trim() : undefined,
        createdBy: req.user!.id,
        updatedBy: req.user!.id,
      });
      createdExpenses.push(newExp);
    }

    res.status(201).json(createdExpenses);
  } catch (err) {
    console.error('Error creating batch expenses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /admin/expenses
router.post('/', createExpenseValidation, handleValidation, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, purpose, amount, amountType, paymentMode, refId, remarks, vendorName, invoiceNumber, gstNumber } = req.body;
    if (purpose.trim().split(/\s+/).length > 100) {
      return res.status(400).json({ message: 'Purpose must be max 100 words' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const expenseId = await getNextSequence('expense');
    const expense = await Expense.create({
      expenseId,
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
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /admin/expenses/:id
router.put('/:id', requireRole('admin'), updateExpenseValidation, handleValidation, async (req: AuthRequest, res: Response) => {
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

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /admin/expenses/:id
router.delete('/:id', requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
