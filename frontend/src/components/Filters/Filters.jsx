import './Filters.css';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function Filters({ filters, onChange }) {
  const { priority = '', breached = false } = filters;

  return (
    <div className="filters" role="search" aria-label="Ticket filters">
      <span className="filters__label">Filters</span>

      <select
        id="filter-priority"
        className="filters__select"
        value={priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>

      <div className="filters__divider" />

      <label
        htmlFor="filter-breached"
        className={`filters__checkbox-label${breached ? ' filters__checkbox-label--active' : ''}`}
      >
        <input
          id="filter-breached"
          type="checkbox"
          className="filters__checkbox"
          checked={breached}
          onChange={(e) => onChange({ ...filters, breached: e.target.checked })}
        />
        ⚠ SLA Breached only
      </label>
    </div>
  );
}
