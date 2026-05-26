import { useState, useCallback, useEffect } from 'react';
import {
  fetchTickets,
  fetchStats,
  createTicket,
  updateTicketStatus,
  deleteTicket,
} from '../api/tickets';

export function useTickets(filters = {}) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setError(null);
      const [ticketData, statsData] = await Promise.all([
        fetchTickets(filters),
        fetchStats(),
      ]);
      setTickets(ticketData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority, filters.breached]);

  useEffect(() => {
    setLoading(true);
    loadAll();
  }, [loadAll]);

  const addTicket = useCallback(async (data) => {
    const ticket = await createTicket(data);
    setTickets((prev) => [ticket, ...prev]);
    const statsData = await fetchStats();
    setStats(statsData);
    return ticket;
  }, []);

  const moveTicket = useCallback(async (id, status) => {
    const updated = await updateTicketStatus(id, status);
    setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
    const statsData = await fetchStats();
    setStats(statsData);
    return updated;
  }, []);

  const removeTicket = useCallback(async (id) => {
    await deleteTicket(id);
    setTickets((prev) => prev.filter((t) => t._id !== id));
    const statsData = await fetchStats();
    setStats(statsData);
  }, []);

  return { tickets, stats, loading, error, addTicket, moveTicket, removeTicket };
}
