import { Parametro, PerfilPlataforma, Registro, AnalyticsResumo, DiagnosticoInstrumentacao } from '../types';

const API_BASE = '/api';

export const api = {
  // Parâmetros Globais
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

  // Perfis de Plataforma Tecnológica
  async getPerfisPlataforma(): Promise<PerfilPlataforma[]> {
    const res = await fetch(`${API_BASE}/perfis-plataforma`);
    if (!res.ok) throw new Error('Falha ao carregar perfis de plataforma');
    return res.json();
  },

  async getPerfilPlataformaById(id: string): Promise<PerfilPlataforma> {
    const res = await fetch(`${API_BASE}/perfis-plataforma/${id}`);
    if (!res.ok) throw new Error('Falha ao carregar perfil de plataforma');
    return res.json();
  },

  async createPerfilPlataforma(data: Partial<PerfilPlataforma>): Promise<PerfilPlataforma> {
    const res = await fetch(`${API_BASE}/perfis-plataforma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao criar perfil de plataforma');
    return res.json();
  },

  async updatePerfilPlataforma(id: string, data: Partial<PerfilPlataforma>): Promise<PerfilPlataforma> {
    const res = await fetch(`${API_BASE}/perfis-plataforma/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao atualizar perfil de plataforma');
    return res.json();
  },

  async deletePerfilPlataforma(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/perfis-plataforma/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir perfil de plataforma');
  },

  // Áreas & Diretorias Corporativas
  async getAreas(): Promise<import('../types').Area[]> {
    const res = await fetch(`${API_BASE}/areas`);
    if (!res.ok) throw new Error('Falha ao carregar áreas corporativas');
    return res.json();
  },

  async createArea(data: Partial<import('../types').Area>): Promise<import('../types').Area> {
    const res = await fetch(`${API_BASE}/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao criar área corporativa');
    }
    return res.json();
  },

  async updateArea(id: string, data: Partial<import('../types').Area>): Promise<import('../types').Area> {
    const res = await fetch(`${API_BASE}/areas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao atualizar área corporativa');
    }
    return res.json();
  },

  async deleteArea(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/areas/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir área corporativa');
  },

  // Registros de Oportunidades
  async getRegistros(filter?: {
    search?: string;
    area?: string;
    situacao?: string;
    complexidade?: string;
    nivelMaturidade?: string;
    arquetipo?: string;
  }): Promise<Registro[]> {
    const params = new URLSearchParams();
    if (filter?.search) params.append('search', filter.search);
    if (filter?.area) params.append('area', filter.area);
    if (filter?.situacao) params.append('situacao', filter.situacao);
    if (filter?.complexidade) params.append('complexidade', filter.complexidade);
    if (filter?.nivelMaturidade) params.append('nivelMaturidade', filter.nivelMaturidade);
    if (filter?.arquetipo) params.append('arquetipo', filter.arquetipo);

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

  async getDiagnostico(id: string): Promise<DiagnosticoInstrumentacao> {
    const res = await fetch(`${API_BASE}/registros/${id}/diagnostico`);
    if (!res.ok) throw new Error('Falha ao obter diagnóstico de instrumentação');
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

  // Analytics & Dashboard
  async getAnalyticsResumo(filter?: {
    registroId?: string;
    area?: string;
    situacao?: string;
    nivelMaturidade?: string;
    arquetipo?: string;
  }): Promise<AnalyticsResumo> {
    const params = new URLSearchParams();
    if (filter?.registroId) params.append('registroId', filter.registroId);
    if (filter?.area) params.append('area', filter.area);
    if (filter?.situacao) params.append('situacao', filter.situacao);
    if (filter?.nivelMaturidade) params.append('nivelMaturidade', filter.nivelMaturidade);
    if (filter?.arquetipo) params.append('arquetipo', filter.arquetipo);

    const qs = params.toString();
    const res = await fetch(`${API_BASE}/analytics/resumo${qs ? `?${qs}` : ''}`);
    if (!res.ok) throw new Error('Falha ao carregar métricas analíticas');
    return res.json();
  },
};
