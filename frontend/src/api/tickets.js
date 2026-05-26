const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.fields = data.fields || null;
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function fetchTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status)   params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.breached) params.set('breached', 'true');

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/tickets${query}`);
  return handleResponse(res);
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/tickets/stats`);
  return handleResponse(res);
}

export async function createTicket(data) {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateTicketStatus(id, status) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function deleteTicket(id) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
