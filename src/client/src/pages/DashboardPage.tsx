import React, { useState, useEffect, useMemo } from 'react';
import { AnalyticsResumo } from '../types';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsResumo | null>(null);
  const [selectedRegistroId, setSelectedRegistroId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('');
  const [situacaoFilter, setSituacaoFilter] = useState<string>('');
  const [complexidadeFilter, setComplexidadeFilter] = useState<string>('');
  const [maturidadeFilter, setMaturidadeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<string>('idAnalise');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (regId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const resumo = await api.getAnalyticsResumo({
        registroId: regId || undefined,
        area: areaFilter || undefined,
        situacao: situacaoFilter || undefined,
        nivelMaturidade: maturidadeFilter || undefined,
      });
      setData(resumo);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do Dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedRegistroId);
  }, [selectedRegistroId, areaFilter, situacaoFilter, maturidadeFilter]);

  // Paleta Governamental Padrão GOV.BR
  const COLORS_MATURIDADE = ['#1351b4', '#ffcd07', '#168821', '#8b5cf6'];
  const COLORS_COMPLEXIDADE = ['#168821', '#ffcd07', '#e52207'];
  const COLORS_TURNO = ['#1351b4', '#0c326f', '#2670e8'];
  const COLORS_ARQUETIPOS = ['#1351b4', '#e52207', '#168821', '#8b5cf6', '#d97706', '#0284c7', '#059669'];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleExpandRow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpandAll = () => {
    if (!filteredAndSortedProcessos.length) return;
    if (expandedRows.size === filteredAndSortedProcessos.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(filteredAndSortedProcessos.map((p) => p.id)));
    }
  };

  const uniqueAreas = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.comparativoProcessos.map((p) => p.area))).filter(Boolean);
  }, [data]);

  // Processed and sorted table data
  const filteredAndSortedProcessos = useMemo(() => {
    if (!data) return [];
    let list = [...data.comparativoProcessos];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          p.idAnalise.toLowerCase().includes(q) ||
          (p.idOrigem && p.idOrigem.toLowerCase().includes(q)) ||
          p.area.toLowerCase().includes(q)
      );
    }

    if (areaFilter) {
      list = list.filter((p) => p.area === areaFilter);
    }

    if (situacaoFilter) {
      list = list.filter((p) => p.situacao === situacaoFilter);
    }

    if (complexidadeFilter) {
      list = list.filter((p) => p.complexidade === complexidadeFilter);
    }

    list.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [data, search, areaFilter, situacaoFilter, complexidadeFilter, sortField, sortDirection]);

  // Bar Chart Data
  const barChartData = useMemo(() => {
    if (!data) return [];
    if (selectedRegistroId) {
      const selected = data.comparativoProcessos.find((p) => p.id === selectedRegistroId);
      if (selected) {
        return [
          {
            idAnalise: selected.idAnalise,
            custoAtualMensal: selected.custoAtualMensal,
            custoToBeMensalAno1: selected.custoToBeMensalAno1,
            custoToBeMensalAno2: selected.custoToBeMensalAno2,
          },
        ];
      }
    }
    return data.comparativoProcessos.slice(0, 10).map((p) => ({
      idAnalise: p.idAnalise,
      custoAtualMensal: p.custoAtualMensal,
      custoToBeMensalAno1: p.custoToBeMensalAno1,
      custoToBeMensalAno2: p.custoToBeMensalAno2,
    }));
  }, [data, selectedRegistroId]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#1351b4] mb-3"></div>
          <p className="text-xs font-semibold">Carregando painel de indicadores estratégicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
        <strong>Erro ao carregar dados:</strong> {error}
      </div>
    );
  }

  if (!data) return null;

  const { kpis, distribuicaoComplexidade, distribuicaoTurno, distribuicaoMaturidade, distribuicaoArquetipos } = data;

  return (
    <div className="space-y-6">
      {/* Header com Filtro de Foco por Processo e Maturidade */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--govbr-blue-warm-vivid-90)] tracking-tight">
            Painel Executivo & Análise de Viabilidade (V2.0)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidação de retorno financeiro (ROI & VPL), maturidade do portfólio e liberação de capacidade.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown Filtro Maturidade */}
          <select
            value={maturidadeFilter}
            onChange={(e) => setMaturidadeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4] font-medium"
          >
            <option value="">Todas as Maturidades</option>
            <option value="N0">N0 — Oportunidades</option>
            <option value="N1">N1 — Business Case Parcial</option>
            <option value="N2">N2 — Business Case Completo</option>
            <option value="N3">N3 — Benefício Realizado</option>
          </select>

          {/* Dropdown Foco Específico */}
          <select
            value={selectedRegistroId}
            onChange={(e) => setSelectedRegistroId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 outline-none cursor-pointer focus:border-[#1351b4] font-bold text-slate-900"
          >
            <option value="">Visão Geral (Todos os Processos)</option>
            {data.todosProcessosDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.idAnalise} - {p.nomeProcesso} ({p.area})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 StatCards Principais de Alto Nível */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="FTEs Liberáveis"
          value={`${kpis.totalFteLiberado} FTE`}
          subtitle={`${kpis.totalProcessos} processos mapeados`}
          iconFa="fas fa-users"
          colorScheme="blue"
        />
        <StatCard
          title="VPL em 3 Anos"
          value={(kpis.totalVpl3Anos || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          subtitle="Valor Presente Líquido (Taxa 12% a.a.)"
          iconFa="fas fa-vault"
          colorScheme="emerald"
        />
        <StatCard
          title="Retorno Líquido (ROI Ano 1)"
          value={kpis.roiAno1Total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          subtitle="Economia líquida após setup"
          iconFa="fas fa-chart-line"
          colorScheme="violet"
        />
        <StatCard
          title="Payback Médio"
          value={`${kpis.paybackMedio} meses`}
          subtitle={`Retorno no 2º ano: R$ ${kpis.roiAno2Total.toLocaleString('pt-BR')}`}
          iconFa="fas fa-clock"
          colorScheme="amber"
        />
      </div>

      {/* Gráficos de Governança V2.0: Comparativo de Custos + Maturidade + Arquétipos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparativo de Custos Bar Chart */}
        <div className="lg:col-span-2 br-card bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">Comparativo de Custos: AS IS vs TO BE</h3>
              <p className="text-xs text-slate-600 m-0 mt-0.5">
                Custo manual atual frente ao custo automatizado (R$/mês)
              </p>
            </div>
            <i className="fas fa-chart-bar text-slate-400 text-base"></i>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="idAnalise" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                <Tooltip
                  formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                  contentStyle={{ backgroundColor: '#0c326f', borderColor: '#1351b4', color: '#fff', borderRadius: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="custoAtualMensal" name="Custo Atual (AS IS)" fill="#e52207" radius={[2, 2, 0, 0]} />
                <Bar dataKey="custoToBeMensalAno1" name="Custo TO BE (Ano 1)" fill="#1351b4" radius={[2, 2, 0, 0]} />
                <Bar dataKey="custoToBeMensalAno2" name="Custo TO BE (Ano 2)" fill="#168821" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição por Maturidade N0-N3 */}
        <div className="br-card bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 m-0">Funil de Maturidade (FCAIA)</h3>
              <p className="text-[11px] text-slate-500 m-0">Status N0 a N3</p>
            </div>
            <i className="fas fa-layer-group text-slate-400 text-sm"></i>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoMaturidade || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {(distribuicaoMaturidade || []).map((_entry: { name: string; value: number }, index: number) => (
                    <Cell key={`cell-mat-${index}`} fill={COLORS_MATURIDADE[index % COLORS_MATURIDADE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c326f', borderRadius: '4px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10.5px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráficos Secundários: 7 Arquétipos + Turnos + Complexidade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Distribuição por 7 Arquétipos</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(distribuicaoArquetipos || []).filter((a: { name: string; value: number }) => a.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                >
                  {(distribuicaoArquetipos || []).map((_entry: { name: string; value: number }, index: number) => (
                    <Cell key={`cell-arq-${index}`} fill={COLORS_ARQUETIPOS[index % COLORS_ARQUETIPOS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c326f', borderRadius: '4px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '9.5px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Distribuição por Turno (HH Robô)</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoTurno}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                >
                  {distribuicaoTurno.map((entry, index) => (
                    <Cell key={`cell-tur-${index}`} fill={COLORS_TURNO[index % COLORS_TURNO.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c326f', borderRadius: '4px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Distribuição por Complexidade</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoComplexidade}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                >
                  {distribuicaoComplexidade.map((entry, index) => (
                    <Cell key={`cell-comp-${index}`} fill={COLORS_COMPLEXIDADE[index % COLORS_COMPLEXIDADE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0c326f', borderRadius: '4px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
