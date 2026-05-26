const mongoose = require('mongoose');

const SLA_HOURS = {
  urgent: 1,
  high: 4,
  medium: 24,
  low: 72,
};

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be one of: low, medium, high, urgent',
      },
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status must be one of: open, in_progress, resolved, closed',
      },
      default: 'open',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { versionKey: false }
);

/**
 * Compute derived fields: ageMinutes, slaBreached
 */
ticketSchema.methods.toComputedJSON = function () {
  const obj = this.toObject();
  const slaHours = SLA_HOURS[this.priority] || 24;
  const targetMs = slaHours * 60 * 60 * 1000;

  // ageMinutes: for resolved/closed use resolvedAt, else use now
  if (
    (this.status === 'resolved' || this.status === 'closed') &&
    this.resolvedAt
  ) {
    obj.ageMinutes = Math.floor(
      (this.resolvedAt - this.createdAt) / 60000
    );
    obj.slaBreached = this.resolvedAt - this.createdAt > targetMs;
  } else {
    obj.ageMinutes = Math.floor((Date.now() - this.createdAt) / 60000);
    obj.slaBreached = Date.now() - this.createdAt > targetMs;
  }

  return obj;
};

ticketSchema.statics.SLA_HOURS = SLA_HOURS;

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
