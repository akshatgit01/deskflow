import './StatsStrip.css';

const STAT_CONFIG = [
  { key: 'open',        label: 'Open',        color: 'var(--status-open)' },
  { key: 'in_progress', label: 'In Progress',  color: 'var(--status-in-progress)' },
  { key: 'resolved',    label: 'Resolved',     color: 'var(--status-resolved)' },
  { key: 'closed',      label: 'Closed',       color: 'var(--status-closed)' },
];

export default function StatsStrip({ stats }) {
  if (!stats) {
    return (
      <div className="stats-strip">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton stats-strip__skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="stats-strip" role="status" aria-label="Ticket statistics">
      {STAT_CONFIG.map(({ key, label, color }) => (
        <div key={key} className="stats-strip__item">
          <span className="stats-strip__dot" style={{ background: color }} />
          <span>{label}</span>
          <span className="stats-strip__value">{stats.byStatus?.[key] ?? 0}</span>
        </div>
      ))}
      <div className="stats-strip__item stats-strip__item--breach">
        <span>⚠</span>
        <span>SLA Breached</span>
        <span className="stats-strip__value">{stats.slaBreachedOpen ?? 0}</span>
      </div>
    </div>
  );
}
