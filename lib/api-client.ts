// Client API pour EPS Manager

const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(error.error || 'Erreur serveur');
    }

    return response.json();
  }

  // ============ UTILISATEURS ============
  async getUsers() {
    return this.request<{ success: boolean; data: any[]; total: number }>('/users');
  }

  async createUser(data: any) {
    return this.request<{ success: boolean; data: any; message: string }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(data: any) {
    return this.request<{ success: boolean; data: any; message: string }>('/users', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ success: boolean; message: string }>(`/users?id=${id}`, {
      method: 'DELETE',
    });
  }

  // ============ PATIENTS ============
  async getPatients(params?: { page?: number; limit?: number; search?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    
    return this.request<{ success: boolean; data: any[]; total: number; page: number }>(`/patients?${query}`);
  }

  async createPatient(data: any) {
    return this.request<{ success: boolean; data: any; message: string }>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePatient(data: any) {
    return this.request<{ success: boolean; data: any }>('/patients', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePatient(id: string) {
    return this.request<{ success: boolean; message: string }>(`/patients?id=${id}`, {
      method: 'DELETE',
    });
  }

  // ============ PERSONNEL ============
  async getPersonnel(params?: { search?: string; statut?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.statut) query.set('statut', params.statut);
    
    return this.request<{ success: boolean; data: any[]; total: number }>(`/personnel?${query}`);
  }

  async createPersonnel(data: any) {
    return this.request<{ success: boolean; data: any }>('/personnel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePersonnel(data: any) {
    return this.request<{ success: boolean; data: any }>('/personnel', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePersonnel(id: string) {
    return this.request<{ success: boolean; message: string }>(`/personnel?id=${id}`, {
      method: 'DELETE',
    });
  }

  // ============ PHARMACIE ============
  async getProduits(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request<{ success: boolean; data: any[]; stocks: any[]; total: number }>(`/pharmacie${query}`);
  }

  async createProduit(data: any) {
    return this.request<{ success: boolean; data: any }>('/pharmacie', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduit(data: any) {
    return this.request<{ success: boolean; data: any }>('/pharmacie', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async mouvementStock(data: { produitId: string; type: 'ENTREE' | 'SORTIE'; quantite: number; lot?: string }) {
    return this.request<{ success: boolean; data: any; message: string }>('/pharmacie', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============ FINANCE ============
  async getTransactions(params?: { type?: string; startDate?: string; endDate?: string }) {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    
    return this.request<{ success: boolean; data: any[]; stats: any }>(`/finance?${query}`);
  }

  async createTransaction(data: any) {
    return this.request<{ success: boolean; data: any; message: string }>('/finance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFinanceStats() {
    return this.request<{ success: boolean; stats: any }>('/finance/stats');
  }
}

export const api = new ApiClient();

// Exemple d'utilisation:
// const { data } = await api.getUsers();
// await api.createUser({ name: 'Dr. Test', email: 'test@eps.ci', role: 'MEDECIN' });