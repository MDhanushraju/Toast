// Central API Service connecting Frontend to deployed Render Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://toast-815a.onrender.com/api';

/**
 * Helper function to handle HTTP requests
 */
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('d227_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP Error ${response.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`[API] Call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const api = {
  baseUrl: API_BASE_URL,

  // Health check endpoint
  async checkHealth() {
    return fetchAPI('/health');
  },

  // Auth endpoints
  async login(username, password) {
    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.token) {
      localStorage.setItem('d227_auth_token', res.token);
    }
    return res;
  },

  async register(userData) {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getMe() {
    return fetchAPI('/auth/me');
  },

  async updateProfile(profileData) {
    return fetchAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  async changePassword(currentPassword, newPassword) {
    return fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Booklet endpoints
  async getBooklets() {
    return fetchAPI('/booklets');
  },

  async getBookletById(id) {
    return fetchAPI('/booklets/' + id);
  },

  async createBooklet(bookletData) {
    return fetchAPI('/booklets', {
      method: 'POST',
      body: JSON.stringify(bookletData),
    });
  },

  async updateBooklet(id, bookletData) {
    return fetchAPI('/booklets/' + id, {
      method: 'PUT',
      body: JSON.stringify(bookletData),
    });
  },

  async deleteBooklet(id) {
    return fetchAPI('/booklets/' + id, {
      method: 'DELETE',
    });
  },

  // Contacts endpoints
  async getContacts() {
    return fetchAPI('/contacts');
  },

  async createContact(contactData) {
    return fetchAPI('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  async deleteContact(id) {
    return fetchAPI('/contacts/' + id, {
      method: 'DELETE',
    });
  },

  // Voting endpoints
  async submitVote(voteData) {
    return fetchAPI('/voting/ballot', {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  },

  async getVoteResults() {
    return fetchAPI('/voting/results');
  },
};

export default api;
