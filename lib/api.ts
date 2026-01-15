// Utilise les routes API internes de Next.js
const API_BASE_URL = '/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
      throw new Error(error.message || 'Une erreur est survenue');
    }

    return response.json();
  }

  // Authentification
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    epsId?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  // Personnel
  async getPersonnel(epsId: string) {
    return this.request(`/rh/personnel?epsId=${epsId}`);
  }

  async createPersonnel(data: unknown) {
    return this.request('/rh/personnel', {
      method: 'POST',
      body: data,
    });
  }

  async updatePersonnel(id: string, data: unknown) {
    return this.request(`/rh/personnel/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deletePersonnel(id: string) {
    return this.request(`/rh/personnel/${id}`, {
      method: 'DELETE',
    });
  }

  // Patients
  async getPatients(epsId: string) {
    return this.request(`/patients?epsId=${epsId}`);
  }

  async createPatient(data: unknown) {
    return this.request('/patients', {
      method: 'POST',
      body: data,
    });
  }

  // Finance & PBF
  async getTransactions(epsId: string, filters?: { startDate?: string; endDate?: string; type?: string }) {
    const params = new URLSearchParams({ epsId });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return this.request(`/finance/transactions?${params.toString()}`);
  }

  async createTransaction(data: unknown) {
    return this.request('/finance/transactions', {
      method: 'POST',
      body: data,
    });
  }

  // Pharmacie
  async getProduits(epsId: string) {
    return this.request(`/pharmacie/produits?epsId=${epsId}`);
  }

  async createProduit(data: unknown) {
    return this.request('/pharmacie/produits', {
      method: 'POST',
      body: data,
    });
  }

  async updateStock(produitId: string, quantite: number, type: 'ENTREE' | 'SORTIE') {
    return this.request(`/pharmacie/stock/${produitId}`, {
      method: 'POST',
      body: { quantite, type },
    });
  }

// Hygiène
  async getChecklists(epsId: string) {
    return this.request(`/hygiene/checklists?epsId=${epsId}`);
  }

  async createChecklist(data: unknown) {
    return this.request('/hygiene/checklists', {
      method: 'POST',
      body: data,
    });
  }

  // EPS
  async getEPS() {
    return this.request('/eps');
  }

  // Seed
  async seedDatabase() {
    return this.request('/seed', { method: 'GET' });
  }

  // Statistiques
  async getStats(epsId: string, periode: string) {
    return this.request(`/stats?epsId=${epsId}&periode=${periode}`);
  }

  async exportReport(epsId: string, type: string, format: 'pdf' | 'excel') {
    return this.request(`/stats/export?epsId=${epsId}&type=${type}&format=${format}`, {
      method: 'GET',
      headers: {
        Accept: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  }
}

export const api = new ApiClient(API_BASE_URL);