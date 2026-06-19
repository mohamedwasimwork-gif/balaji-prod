import { body } from 'express-validator';

export const createProjectValidation = [
  body('projectTitle').isString().trim().isLength({ min: 1, max: 200 }).withMessage('Project title is required (max 200 chars)'),
  body('companyName').isString().trim().isLength({ min: 1, max: 200 }).withMessage('Company name is required'),
  body('clientName').isString().trim().isLength({ min: 1, max: 200 }).withMessage('Client name is required'),
  body('phoneNumber').isString().trim().isLength({ min: 1, max: 20 }).withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('gstNumber').optional().isString().trim().isLength({ max: 20 }).withMessage('GST number max 20 chars'),
  body('address').optional().isObject(),
  body('address.line1').optional().isString().trim(),
  body('address.line2').optional().isString().trim(),
  body('address.city').optional().isString().trim(),
  body('address.state').optional().isString().trim(),
  body('address.pincode').optional().isString().trim(),
  body('address.country').optional().isString().trim(),
  body('status').optional().isIn(['active', 'draft', 'inactive']).withMessage('Status must be active, draft, or inactive'),
];

export const updateProjectValidation = [
  body('projectTitle').optional().isString().trim().isLength({ min: 1, max: 200 }),
  body('companyName').optional().isString().trim().isLength({ min: 1, max: 200 }),
  body('clientName').optional().isString().trim().isLength({ min: 1, max: 200 }),
  body('phoneNumber').optional().isString().trim().isLength({ min: 1, max: 20 }),
  body('email').optional().isEmail(),
  body('gstNumber').optional().isString().trim().isLength({ max: 20 }),
  body('address').optional().isObject(),
  body('address.line1').optional().isString().trim(),
  body('address.line2').optional().isString().trim(),
  body('address.city').optional().isString().trim(),
  body('address.state').optional().isString().trim(),
  body('address.pincode').optional().isString().trim(),
  body('address.country').optional().isString().trim(),
  body('status').optional().isIn(['active', 'draft', 'inactive']),
];
