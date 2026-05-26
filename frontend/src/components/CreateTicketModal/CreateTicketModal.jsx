import { useState } from 'react';
import './CreateTicketModal.css';

const INITIAL_FORM = { subject: '', description: '', customerEmail: '', priority: '' };

function validate(form) {
  const errors = {};
  if (!form.subject.trim())       errors.subject = 'Subject is required';
  if (!form.description.trim())   errors.description = 'Description is required';
  if (!form.customerEmail.trim()) {
    errors.customerEmail = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) {
    errors.customerEmail = 'Enter a valid email address';
  }
  if (!form.priority) errors.priority = 'Please select a priority';
  return errors;
}

export default function CreateTicketModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      // Merge API field errors if present
      if (err.fields) {
        setErrors(err.fields);
      } else {
        setApiError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Close on overlay click
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">✦ New Support Ticket</h2>
          <button
            className="modal__close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="modal__api-error" role="alert">⚠ {apiError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            {/* Subject */}
            <div className={`form-group${errors.subject ? ' form-group--error' : ''}`}>
              <label htmlFor="ticket-subject">Subject</label>
              <input
                id="ticket-subject"
                name="subject"
                type="text"
                placeholder="Brief description of the issue"
                value={form.subject}
                onChange={handleChange}
                autoFocus
              />
              {errors.subject && (
                <span className="form-error" role="alert">⚠ {errors.subject}</span>
              )}
            </div>

            {/* Description */}
            <div className={`form-group${errors.description ? ' form-group--error' : ''}`}>
              <label htmlFor="ticket-description">Description</label>
              <textarea
                id="ticket-description"
                name="description"
                placeholder="Detailed description of the issue…"
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className="form-error" role="alert">⚠ {errors.description}</span>
              )}
            </div>

            {/* Email */}
            <div className={`form-group${errors.customerEmail ? ' form-group--error' : ''}`}>
              <label htmlFor="ticket-email">Customer Email</label>
              <input
                id="ticket-email"
                name="customerEmail"
                type="email"
                placeholder="customer@example.com"
                value={form.customerEmail}
                onChange={handleChange}
              />
              {errors.customerEmail && (
                <span className="form-error" role="alert">⚠ {errors.customerEmail}</span>
              )}
            </div>

            {/* Priority */}
            <div className={`form-group${errors.priority ? ' form-group--error' : ''}`}>
              <label htmlFor="ticket-priority">Priority</label>
              <select
                id="ticket-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="">Select priority…</option>
                <option value="low">⚫ Low — 72h SLA</option>
                <option value="medium">🔵 Medium — 24h SLA</option>
                <option value="high">🟠 High — 4h SLA</option>
                <option value="urgent">🔴 Urgent — 1h SLA</option>
              </select>
              {errors.priority && (
                <span className="form-error" role="alert">⚠ {errors.priority}</span>
              )}
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-ticket-btn"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? (
                <><span className="spinner" /> Creating…</>
              ) : (
                '✦ Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
