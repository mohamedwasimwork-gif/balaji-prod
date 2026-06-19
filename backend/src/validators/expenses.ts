import { body } from 'express-validator';

export const createExpenseValidation = [
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('purpose').isString().trim().isLength({ min: 1, max: 5000 }).withMessage('Purpose is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('amountType').isIn(['credit', 'debit']).withMessage('Amount type must be credit or debit'),
  body('paymentMode').isIn(['cash', 'upi', 'bank', 'other']).withMessage('Payment mode must be cash, upi, bank, or other'),
  body('refId').isString().trim().notEmpty().withMessage('Reference ID is required'),
  body('remarks').optional().isString().isLength({ max: 500 }),
  body('vendorName').optional().isString().trim().isLength({ max: 500 }),
  body('invoiceNumber').optional().isString().trim().isLength({ max: 100 }),
  body('gstNumber').optional().isString().trim().isLength({ max: 20 }),
];

export const updateExpenseValidation = [
  body('purpose').optional().isString().trim().isLength({ min: 1, max: 5000 }),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('amountType').optional().isIn(['credit', 'debit']),
  body('paymentMode').optional().isIn(['cash', 'upi', 'bank', 'other']),
  body('refId').optional().isString().trim(),
  body('remarks').optional().isString().isLength({ max: 500 }),
  body('vendorName').optional().isString().trim().isLength({ max: 500 }),
  body('invoiceNumber').optional().isString().trim().isLength({ max: 100 }),
  body('gstNumber').optional().isString().trim().isLength({ max: 20 }),
];
