/**
 * API client helper with default credentials and JSON parsing
 */

const BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // sends HTTP-only session cookie
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'A network error occurred.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  getMe: () => apiRequest('/auth/me'),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  verifyEmail: (token) => apiRequest(`/auth/verify-email?token=${encodeURIComponent(token)}`),
  getUsers: () => apiRequest('/auth/users'),
  updateUserRole: (userId, role) => apiRequest(`/auth/users/${userId}/role`, { method: 'PATCH', body: { role } }),

  // Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    return apiRequest(`/events?${query.toString()}`);
  },
  getEventById: (id) => apiRequest(`/events/${id}`),
  createEvent: (eventData) => apiRequest('/events', { method: 'POST', body: eventData }),
  updateEvent: (id, eventData) => apiRequest(`/events/${id}`, { method: 'PUT', body: eventData }),
  getOrganizerEvents: () => apiRequest('/events/organizer/my-events'),
  getAdminEvents: (status) => apiRequest(`/events/admin/all${status ? `?status=${status}` : ''}`),
  reviewEvent: (id, reviewData) => apiRequest(`/events/${id}/review`, { method: 'PATCH', body: reviewData }),

  // Registrations
  registerForEvent: (eventId) => apiRequest(`/registrations/events/${eventId}`, { method: 'POST' }),
  cancelRegistration: (registrationId) => apiRequest(`/registrations/${registrationId}`, { method: 'DELETE' }),
  getMyRegistrations: () => apiRequest('/registrations/my-registrations'),
  getEventAttendees: (eventId) => apiRequest(`/registrations/events/${eventId}/attendees`),
};
