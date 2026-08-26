import { Parametro, Registro, AnalyticsResumo } from '../types';

const API_BASE = '/api';

export const api = {
  // Parâmetros
  async getParametros(): Promise<Parametro> {
    const res = await fetch(`${API_BASE}/parametros`);
    if (!res.ok) throw new Error('Falha ao carregar parâmetros');
    return res.json();
  },

  async updateParametros(data: Partial<Parametro>): Promise<Parametro> {
    const res = await fetch(`${API_BASE}/parametros`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao atualizar parâmetros');
    return res.json();
  },

  // Registros
  async getRegistros(filter?: { search?: string; area?: string; situacao?: string; complexidade?: string }): Promise<Registro[]> {
    const params = new URLSearchParams();
    if (filter?.search) params.append('search', filter.search);
    if (filter?.area) params.append('area', filter.area);
    if (filter?.situacao) params.append('situacao', filter.situacao);
    if (filter?.complexidade) params.append('complexidade', filter.complexidade);

    const qs = params.toString();
    const res = await fetch(`${API_BASE}/registros${qs ? `?${qs}` : ''}`);
    if (!res.ok) throw new Error('Falha ao buscar registros');
    return res.json();
  },

  async getRegistroById(id: string): Promise<Registro> {
    const res = await fetch(`${API_BASE}/registros/${id}`);
    if (!res.ok) throw new Error('Falha ao carregar registro');
    return res.json();
  },

  async createRegistro(data: Partial<Registro>): Promise<Registro> {
    const res = await fetch(`${API_BASE}/registros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao criar registro');
    return res.json();
  },

  async updateRegistro(id: string, data: Partial<Registro>): Promise<Registro> {
    const res = await fetch(`${API_BASE}/registros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao atualizar registro');
    return res.json();
  },

  async deleteRegistro(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/registros/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir registro');
  },

  // Analytics
  async getAnalyticsResumo(filter?: { registroId?: string; area?: string; situacao?: string }): Promise<AnalyticsResumo> {
    const params = new URLSearchParams();
    if (filter?.registroId) params.append('registroId', filter.registroId);
    if (filter?.area) params.append('area', filter.area);
    if (filter?.situacao) params.append('situacao', filter.situacao);

    const qs = params.toString();
    const res = await fetch(`${API_BASE}/analytics/resumo${qs ? `?${qs}` : ''}`);
    if (!res.ok) throw new Error('Falha ao carregar métricas analíticas');
    return res.json();
  },
};
