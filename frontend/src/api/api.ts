const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

export const api = {
  // Auth
  async checkSetupStatus() {
    const res = await fetch(`${API_BASE}/auth/status`);
    return res.json();
  },

  async setup(username: string, password: string, language: string) {
    const res = await fetch(`${API_BASE}/auth/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, language })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async updateLanguage(language: string) {
    const res = await fetch(`${API_BASE}/auth/language`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ language })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text) as { error?: string };
        throw new Error(json.error ?? text);
      } catch {
        throw new Error(text);
      }
    }
    return res.json();
  },

  // Sessions
  async uploadTest(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const res = await fetch(`${API_BASE}/sessions/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getSessions() {
    const res = await fetch(`${API_BASE}/sessions`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getSession(id: number) {
    const res = await fetch(`${API_BASE}/sessions/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deleteSession(id: number) {
    const res = await fetch(`${API_BASE}/sessions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async saveTestResult(sessionId: number, testPath: string, status: string, bugs: string) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/results`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ test_path: testPath, status, bugs })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Templates
  async getTemplates() {
    const res = await fetch(`${API_BASE}/templates`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getTemplate(id: number) {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async createTemplate(name: string, description: string, content: string) {
    const res = await fetch(`${API_BASE}/templates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, description, content })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async deleteTemplate(id: number) {
    const res = await fetch(`${API_BASE}/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Export
  async exportMarkdown(sessionId: number) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/export/${sessionId}/markdown`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error(await res.text());
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${sessionId}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  async exportHTML(sessionId: number) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/export/${sessionId}/html`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error(await res.text());
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${sessionId}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  },

  async exportJSON(sessionId: number) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/export/${sessionId}/json`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${sessionId}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
