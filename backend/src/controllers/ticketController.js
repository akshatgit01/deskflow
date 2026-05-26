const Ticket = require('../models/Ticket');

// Valid status transitions
const VALID_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: [],
};

// Transition descriptors for error messages
const TRANSITION_DESC = {
  open: 'open → in_progress',
  in_progress: 'in_progress → open  OR  in_progress → resolved',
  resolved: 'resolved → in_progress  OR  resolved → closed',
  closed: 'none (terminal state)',
};

function addComputedFields(ticket) {
  return ticket.toComputedJSON();
}

// POST /api/tickets
exports.createTicket = async (req, res, next) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;
    const ticket = await Ticket.create({
      subject,
      description,
      customerEmail,
      priority,
    });
    return res.status(201).json(addComputedFields(ticket));
  } catch (err) {
    next(err);
  }
};

// GET /api/tickets
exports.getTickets = async (req, res, next) => {
  try {
    const { status, priority, breached } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    let result = tickets.map(addComputedFields);

    // breached filter — computed field, so filter in JS
    if (breached === 'true') {
      result = result.filter((t) => t.slaBreached === true);
    }

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/tickets/stats
exports.getStats = async (req, res, next) => {
  try {
    const allTickets = await Ticket.find({});
    const byStatus = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
    const byPriority = { low: 0, medium: 0, high: 0, urgent: 0 };
    let slaBreachedOpen = 0;

    for (const ticket of allTickets) {
      byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1;
      byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1;

      if (ticket.status === 'open' || ticket.status === 'in_progress') {
        const computed = addComputedFields(ticket);
        if (computed.slaBreached) slaBreachedOpen++;
      }
    }

    return res.json({ byStatus, byPriority, slaBreachedOpen });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tickets/:id
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: true, message: 'Ticket not found' });
    }

    const currentStatus = ticket.status;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        error: true,
        message: `Invalid status transition: "${currentStatus}" → "${newStatus}". Allowed from "${currentStatus}": ${TRANSITION_DESC[currentStatus]}`,
      });
    }

    // Handle resolvedAt
    if (newStatus === 'resolved') {
      ticket.resolvedAt = new Date();
    } else if (currentStatus === 'resolved' && newStatus === 'in_progress') {
      ticket.resolvedAt = null;
    }

    ticket.status = newStatus;
    await ticket.save();

    return res.json(addComputedFields(ticket));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tickets/:id
exports.deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({ error: true, message: 'Ticket not found' });
    }
    return res.json({ message: 'Ticket deleted' });
  } catch (err) {
    next(err);
  }
};
