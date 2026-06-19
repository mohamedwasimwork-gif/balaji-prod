import { body } from 'express-validator';

export const webhookLeadValidation = [
  body('name').isString().trim().isLength({ min: 1, max: 200 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString().isLength({ max: 20 }),
  body('service').optional().isString().isLength({ max: 200 }),
  body('message').optional().isString().isLength({ max: 2000 }),
  body('formName').optional().isString().isLength({ max: 100 }),
];

export const updateLeadValidation = [
  body('status').optional().isIn(['new', 'contacted', 'closed']).withMessage('Status must be new, contacted, or closed'),
  body('notes').optional().isString().isLength({ max: 2000 }),
];
