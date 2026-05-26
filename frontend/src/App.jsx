import { useState, useMemo } from 'react';
import StatsStrip from './components/StatsStrip/StatsStrip';
import Filters from './components/Filters/Filters';
import Board from './components/Board/Board';
import CreateTicketModal from './components/CreateTicketModal/CreateTicketModal';
import { useTickets } from './hooks/useTickets';

export default function App() {
  const [filters, setFilters] = useState({ priority: '', breached: false });
  const [showModal, setShowModal] = useState(false);

  // Build API-compatible filter object
  const apiFilters = useMemo(() => ({
    priority: filters.priority || undefined,
    breached: filters.breached || undefined,
  }), [filters.priority, filters.breached]);

  const { tickets, stats, loading, error, addTicket, moveTicket, removeTicket } =
    useTickets(apiFilters);

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo" aria-hidden="true">D</div>
          <div>
            <div className="app-header__title">DeskFlow</div>
            <div className="app-header__subtitle">Support Ticket Triage</div>
          </div>
        </div>

        <button
          id="new-ticket-btn"
          className="btn-new-ticket"
          onClick={() => setShowModal(true)}
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">✦</span> New Ticket
        </button>
      </header>

      {/* ── Error Banner ── */}
      {error && (
        <div className="error-banner" role="alert">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <main className="app-main">
        {/* ── Stats Strip ── */}
        <StatsStrip stats={stats} />

        {/* ── Filters ── */}
        <Filters filters={filters} onChange={setFilters} />

        {/* ── Kanban Board ── */}
        <Board
          tickets={tickets}
          loading={loading}
          onMove={moveTicket}
          onDelete={removeTicket}
        />
      </main>

      {/* ── Create Ticket Modal ── */}
      {showModal && (
        <CreateTicketModal
          onClose={() => setShowModal(false)}
          onSubmit={addTicket}
        />
      )}
    </div>
  );
}
