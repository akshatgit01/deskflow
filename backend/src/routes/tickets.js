const { Router } = require('express');
const { body, param, query, validationResult } = require('express-validator');
const ctrl = require('../controllers/ticketController');

const router = Router();

// Validation middleware helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fields = {};
    errors.array().forEach((e) => {
      fields[e.path] = e.msg;
    });
    return res.status(400).json({ error: true, message: 'Validation failed', fields });
  }
  next();
};

// ── GET /api/tickets/stats  ← must come BEFORE /:id route ──
router.get('/stats', ctrl.getStats);

// ── GET /api/tickets ──
router.get(
  '/',
  [
    query('status')
      .optional()
      .isIn(['open', 'in_progress', 'resolved', 'closed'])
      .withMessage('Invalid status filter'),
    query('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority filter'),
    query('breached').optional().isIn(['true', 'false']).withMessage('breached must be true or false'),
  ],
  validate,
  ctrl.getTickets
);

// ── POST /api/tickets ──
router.post(
  '/',
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('customerEmail')
      .trim()
      .notEmpty()
      .withMessage('Customer email is required')
      .isEmail()
      .withMessage('Must be a valid email address'),
    body('priority')
      .notEmpty()
      .withMessage('Priority is required')
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Priority must be one of: low, medium, high, urgent'),
  ],
  validate,
  ctrl.createTicket
);

// ── PATCH /api/tickets/:id ──
router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid ticket ID'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['open', 'in_progress', 'resolved', 'closed'])
      .withMessage('Status must be one of: open, in_progress, resolved, closed'),
  ],
  validate,
  ctrl.updateTicketStatus
);

// ── DELETE /api/tickets/:id ──
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid ticket ID')],
  validate,
  ctrl.deleteTicket
);

module.exports = router;
