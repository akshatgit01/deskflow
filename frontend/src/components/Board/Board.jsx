import TicketCard from '../TicketCard/TicketCard';
import './Board.css';

const COLUMNS = [
  { status: 'open',        label: 'Open' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'resolved',    label: 'Resolved' },
  { status: 'closed',      label: 'Closed' },
];

function SkeletonCard() {
  return (
    <div className="ticket-card-skeleton">
      <div className="skeleton ticket-card-skeleton__line" style={{ height: 14, width: '70%' }} />
      <div className="skeleton ticket-card-skeleton__line" style={{ height: 10, width: '40%' }} />
      <div className="skeleton ticket-card-skeleton__line" style={{ height: 10, width: '55%' }} />
    </div>
  );
}

export default function Board({ tickets, loading, onMove, onDelete }) {
  return (
    <section className="board" aria-label="Ticket board">
      {COLUMNS.map(({ status, label }) => {
        const columnTickets = tickets.filter((t) => t.status === status);

        return (
          <div
            key={status}
            className="board-column"
            data-status={status}
            aria-label={`${label} column`}
          >
            <div className="board-column__header">
              <div className="board-column__title">
                <span className="board-column__dot" />
                {label}
              </div>
              <span className="board-column__count">
                {loading ? '–' : columnTickets.length}
              </span>
            </div>

            <div className="board-column__body">
              {loading ? (
                [1, 2].map((i) => <SkeletonCard key={i} />)
              ) : columnTickets.length === 0 ? (
                <div className="board-column__empty">
                  <span className="board-column__empty-icon">📭</span>
                  <span>No tickets</span>
                </div>
              ) : (
                columnTickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    onMove={onMove}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
