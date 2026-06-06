const BASE = 'https://synora-backend-i183.onrender.com';

export async function login(username, password) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE}/stats`);
  return res.json();
}

export async function getCustomers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.gender) params.set('gender', filters.gender);
  if (filters.city) params.set('city', filters.city);
  if (filters.search) params.set('search', filters.search);
  const res = await fetch(`${BASE}/customers?${params}`);
  return res.json();
}

export async function getCustomer(id) {
  const res = await fetch(`${BASE}/customers/${id}`);
  return res.json();
}

export async function updateStatus(id, status) {
  const res = await fetch(`${BASE}/customers/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function getNotes(id) {
  const res = await fetch(`${BASE}/customers/${id}/notes`);
  return res.json();
}

export async function addNote(id, note) {
  const res = await fetch(`${BASE}/customers/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
  return res.json();
}

export async function deleteNote(noteId) {
  const res = await fetch(`${BASE}/notes/${noteId}`, { method: 'DELETE' });
  return res.json();
}

export async function getMatches(id) {
  const res = await fetch(`${BASE}/customers/${id}/matches`);
  return res.json();
}
