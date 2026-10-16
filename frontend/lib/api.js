const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export function getToken() { if (typeof window === 'undefined') return ''; return localStorage.getItem('pos_token') || ''; }
export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }, cache: 'no-store' });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
