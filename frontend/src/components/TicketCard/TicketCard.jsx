import { useState } from 'react';
import './TicketCard.css';

// Valid next transitions (forward = accent, back = muted)
const NEXT_TRANSITIONS = {
  open:        [{ status: 'in_progress', label: '→ In Progress', back: false }],
  in_progress: [
    { status: 'open',     label: '← Open',       back: true },
    { status: 'resolved', label: '→ Resolved',    back: false },
  ],
  resolved: [
    { status: 'in_progress', label: '← In Progress', back: true },
    { status: 'closed',      label: '→ Closed',       back: false },
  ],
  closed: [],
};

function formatAge(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function TicketCard({ ticket, onMove, onDelete }) {
  const [moving, setMoving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { _id, subject, customerEmail, priority, status, ageMinutes, slaBreached } = ticket;
  const transitions = NEXT_TRANSITIONS[status] || [];

  async function handleMove(newStatus) {
    setMoving(true);
    try {
      await onMove(_id, newStatus);
    } finally {
      setMoving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ticket "${subject}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(_id);
    } finally {
      setDeleting(false);
    }
  }

  const isLoading = moving || deleting;

  return (
    <article
      className={`ticket-card${isLoading ? ' ticket-card--loading' : ''}`}
      data-priority={priority}
      aria-label={`Ticket: ${subject}`}
    >
      {isLoading && (
        <div className="ticket-card__spinner">
          <span className="spinner" />
        </div>
      )}

      <div className="ticket-card__header">
        <h3 className="ticket-card__subject">{subject}</h3>
        <button
          className="ticket-card__delete-btn"
          onClick={handleDelete}
          title="Delete ticket"
          aria-label="Delete ticket"
          disabled={isLoading}
        >
          ✕
        </button>
      </div>

      <div className="ticket-card__meta">
        <span className={`priority-badge priority-badge--${priority}`}>
          {priority === 'urgent' ? '🔴' : priority === 'high' ? '🟠' : priority === 'medium' ? '🔵' : '⚫'} {priority}
        </span>
        <span className="ticket-card__age">{formatAge(ageMinutes ?? 0)}</span>
      </div>

      {slaBreached && (
        <div className="sla-breach" role="alert">
          ⚠ SLA Breached
        </div>
      )}

      <p className="ticket-card__email" title={customerEmail}>{customerEmail}</p>

      {transitions.length > 0 && (
        <div className="ticket-card__actions">
          {transitions.map(({ status: nextStatus, label, back }) => (
            <button
              key={nextStatus}
              className={`btn-move${back ? ' btn-move--back' : ''}`}
              onClick={() => handleMove(nextStatus)}
              disabled={isLoading}
              aria-label={`Move ticket to ${nextStatus}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
