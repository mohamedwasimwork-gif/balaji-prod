import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Expense } from '../models/Expense.js';
import { Invoice } from '../models/Invoice.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /admin/download/report?companyName=... | ?projectId=...
// Scoped either to every project of a company, or to a single project.
router.get('/report', async (req: AuthRequest, res: Response) => {
  try {
    const { companyName, projectId } = req.query;
    const hasProjectId = typeof projectId === 'string' && projectId.trim().length > 0;
    const hasCompanyName = typeof companyName === 'string' && companyName.trim().length > 0;

    if (!hasProjectId && !hasCompanyName) {
      return res.status(400).json({ message: 'Either projectId or companyName query parameter is required' });
    }
    if (hasProjectId && !mongoose.Types.ObjectId.isValid(projectId as string)) {
      return res.status(400).json({ message: 'Valid Project ID is required' });
    }

    // A project id is the narrower scope, so it wins when both are supplied.
    const projects = hasProjectId
      ? await Project.find({ _id: projectId as string })
      : await Project.find({ companyName: { $regex: (companyName as string).trim(), $options: 'i' } });

    // Labels the report; falls back to the search term when nothing matched.
    const scopeLabel = projects[0]
      ? (hasProjectId ? projects[0].projectTitle : projects[0].companyName)
      : ((companyName as string) || '').trim();

    if (projects.length === 0) {
      return res.json({
        companyName: scopeLabel,
        generatedAt: new Date().toISOString(),
        projects: [],
        paymentAdvice: { credits: [], creditTotal: 0, debits: [], debitTotal: 0 },
        billing: { credits: [], creditTotal: 0, debits: [], debitTotal: 0 },
      });
    }

    const projectIds = projects.map((p) => p._id);

    // Fetch all expenses and invoices for matching projects
    const [expenses, invoices] = await Promise.all([
      Expense.find({ projectId: { $in: projectIds } }).sort({ expenseDate: 1, createdAt: 1 }),
      Invoice.find({ projectId: { $in: projectIds } }).sort({ invoiceDate: 1, createdAt: 1 }),
    ]);

    // Separate expenses into credits and debits
    const expenseCredits = expenses.filter((e) => e.amountType === 'credit');
    const expenseDebits = expenses.filter((e) => e.amountType === 'debit');

    // Separate invoices into credits and debits
    const invoiceCredits = invoices.filter((i) => i.amountType === 'credit');
    const invoiceDebits = invoices.filter((i) => i.amountType === 'debit');

    const mapEntry = (entry: any) => ({
      id: entry.expenseId || entry.invoiceId,
      date: entry.expenseDate ?? entry.invoiceDate ?? entry.createdAt,
      projectTitle: entry.projectSnapshot?.projectTitle || '',
      purpose: entry.purpose,
      amount: entry.amount,
      paymentMode: entry.paymentMode,
      refId: entry.refId,
      vendorName: entry.vendorName || '',
      invoiceNumber: entry.invoiceNumber || '',
      gstNumber: entry.gstNumber || '',
      remarks: entry.remarks || '',
    });

    const sum = (items: any[]) => items.reduce((acc, item) => acc + item.amount, 0);

    res.json({
      companyName: scopeLabel,
      generatedAt: new Date().toISOString(),
      projects: projects.map((p) => ({ projectTitle: p.projectTitle, projectId: p._id })),
      paymentAdvice: {
        credits: expenseCredits.map(mapEntry),
        creditTotal: sum(expenseCredits),
        debits: expenseDebits.map(mapEntry),
        debitTotal: sum(expenseDebits),
      },
      billing: {
        credits: invoiceCredits.map(mapEntry),
        creditTotal: sum(invoiceCredits),
        debits: invoiceDebits.map(mapEntry),
        debitTotal: sum(invoiceDebits),
      },
    });
  } catch (err) {
    console.error('Download report error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
