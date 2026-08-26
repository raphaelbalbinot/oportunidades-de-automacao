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
  const [sortField, setSortField] = useState<string>('idAnalise');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (regId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const resumo = await api.getAnalyticsResumo({ registroId: regId || undefined });
      setData(resumo);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do Dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedRegistroId);
  }, [selectedRegistroId]);

  // Paleta Governamental Padrão GOV.BR
  const COLORS_COMPLEXIDADE = ['#168821', '#ffcd07', '#e52207'];
  const COLORS_TURNO = ['#1351b4', '#0c326f', '#2670e8'];

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

  // Distribuição por Complexidade: Sempre Global
  const globalComplexidade = useMemo(() => {
    if (!data) return [];
    const counts: Record<string, number> = { Baixa: 0, Média: 0, Alta: 0 };
    data.comparativoProcessos.forEach((p) => {
      counts[p.complexidade] = (counts[p.complexidade] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Bar Chart Data: Agrupado quando Todos os Processos está selecionado
  const barChartData = useMemo(() => {
    if (!data) return [];
    if (selectedRegistroId) {
      const selected = data.comparativoProcessos.find((p) => p.id === selectedRegistroId);
      if (selected) {
        return [
          {
            idAnalise: `${selected.idAnalise} - ${selected.nome}`,
            custoAtualMensal: selected.custoAtualMensal,
            custoToBeMensalAno1: selected.custoToBeMensalAno1,
            custoToBeMensalAno2: selected.custoToBeMensalAno2,
          },
        ];
      }
    }

    // Todos os Processos selecionados: Exibe os valores agregados consolidados da lista filtrada
    const totalAtual = filteredAndSortedProcessos.reduce((acc, p) => acc + p.custoAtualMensal, 0);
    const totalAno1 = filteredAndSortedProcessos.reduce((acc, p) => acc + p.custoToBeMensalAno1, 0);
    const totalAno2 = filteredAndSortedProcessos.reduce((acc, p) => acc + p.custoToBeMensalAno2, 0);

    return [
      {
        idAnalise: 'Consolidado Geral',
        custoAtualMensal: Number(totalAtual.toFixed(2)),
        custoToBeMensalAno1: Number(totalAno1.toFixed(2)),
        custoToBeMensalAno2: Number(totalAno2.toFixed(2)),
      },
    ];
  }, [data, selectedRegistroId, filteredAndSortedProcessos]);

  // Click on row to focus on single process and automatically expand its drawer
  const handleRowClick = (procId: string) => {
    if (selectedRegistroId === procId) {
      setSelectedRegistroId('');
    } else {
      setSelectedRegistroId(procId);
      setExpandedRows((prev) => {
        const next = new Set(prev);
        next.add(procId);
        return next;
      });
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1351b4]"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-900">
        <p className="font-bold text-sm">Erro ao carregar dashboard</p>
        <p className="text-xs mt-1">{error}</p>
        <button
          type="button"
          onClick={() => loadData()}
          className="mt-3 px-4 py-2 bg-red-700 text-white rounded text-xs font-semibold hover:bg-red-800 cursor-pointer"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { kpis, distribuicaoTurno, todosProcessosDisponiveis, isSpecificRecord } = data;

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <i className="fas fa-sort text-slate-300 ml-1 text-xs"></i>;
    }
    return sortDirection === 'asc' ? (
      <i className="fas fa-sort-up text-[#1351b4] ml-1 text-xs"></i>
    ) : (
      <i className="fas fa-sort-down text-[#1351b4] ml-1 text-xs"></i>
    );
  };

  const isAllExpanded = filteredAndSortedProcessos.length > 0 && expandedRows.size === filteredAndSortedProcessos.length;

  return (
    <div className="space-y-6">
      {/* Top Header & Scope Selector */}
      <div className="br-card bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Painel Executivo & Análise de Viabilidade</h2>
            {isSpecificRecord && (
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 flex items-center space-x-1">
                <span>Foco: {data.selectedRecord?.idAnalise} - {data.selectedRecord?.nomeProcesso}</span>
                <button
                  type="button"
                  onClick={() => setSelectedRegistroId('')}
                  className="ml-1 text-blue-700 hover:text-blue-950 cursor-pointer"
                  title="Limpar foco e ver todos"
                >
                  <i className="fas fa-undo-alt text-xs ml-1"></i>
                </button>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 m-0">
            Consolidação de ganhos financeiros, FTE liberável, matriz de benefícios e payback para oportunidades de automação.
          </p>
        </div>

        {/* Scope Dropdown */}
        <div className="scope-selector-box flex items-center space-x-2 self-start sm:self-auto bg-slate-50 p-2 rounded-md border border-slate-200">
          <i className="fas fa-filter text-slate-500 ml-1 text-xs"></i>
          <span className="scope-label text-xs font-semibold text-slate-700 whitespace-nowrap">Escopo da Análise:</span>
          <select
            value={selectedRegistroId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedRegistroId(val);
              if (val) {
                setExpandedRows((prev) => new Set(prev).add(val));
              }
            }}
            className="scope-select text-xs font-medium bg-white text-slate-800 border border-slate-300 rounded px-3 py-1.5 focus:border-[#1351b4] outline-none cursor-pointer"
          >
            <option value="">🌐 Todos os Processos (Visão Global Consolidada)</option>
            {todosProcessosDisponiveis.map((p) => (
              <option key={p.id} value={p.id}>
                📍 {p.idAnalise} - {p.nomeProcesso} ({p.area})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Processos Avaliados"
          value={kpis.totalProcessos}
          subtitle={isSpecificRecord ? "Visualizando 1 processo específico" : "Total de oportunidades cadastradas"}
          iconFa="fas fa-layer-group"
          colorScheme="blue"
        />
        <StatCard
          title="FTE Total Liberável"
          value={`${kpis.totalFteLiberado} FTE`}
          subtitle="Equivalente em horas homem poupadas"
          iconFa="fas fa-users"
          colorScheme="emerald"
        />
        <StatCard
          title="ROI Anual (Ano 1)"
          value={`R$ ${kpis.roiAno1Total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
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

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Custo Atual (AS IS) Mensal</span>
            <div className="text-lg font-bold text-red-600 mt-0.5">
              R$ {kpis.custoAtualMensalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full border border-red-200 flex items-center justify-center">
            <i className="fas fa-dollar-sign text-base"></i>
          </div>
        </div>

        <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Custo Automatizado (TO BE) Ano 1/mês</span>
            <div className="text-lg font-bold text-[var(--govbr-blue-warm-vivid-70)] mt-0.5">
              R$ {kpis.custoMensalAno1Total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[var(--govbr-blue-warm-vivid-70)] rounded-full border border-blue-200 flex items-center justify-center">
            <i className="fas fa-check-circle text-base"></i>
          </div>
        </div>

        <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pontuação Média de Benefícios</span>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">
              {kpis.pontuacaoMediaPercent}%
            </div>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 flex items-center justify-center">
            <i className="fas fa-award text-base"></i>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Comparison Bar Chart */}
        <div className="lg:col-span-2 br-card bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 m-0">Comparativo de Custos Mensais: AS IS vs TO BE</h3>
              <p className="text-xs text-slate-600 m-0 mt-0.5">
                {selectedRegistroId
                  ? 'Custo individual do processo selecionado (R$/Mês)'
                  : 'Valores consolidados agrupados de todos os processos (R$/Mês)'}
              </p>
            </div>
            <i className="fas fa-chart-bar text-slate-400 text-base"></i>
          </div>
          <div className="h-72">
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
                <Bar dataKey="custoAtualMensal" name="Custo Manual Atual (AS IS)" fill="#e52207" radius={[2, 2, 0, 0]} />
                <Bar dataKey="custoToBeMensalAno1" name="Custo TO BE (Ano 1 com Setup)" fill="#1351b4" radius={[2, 2, 0, 0]} />
                <Bar dataKey="custoToBeMensalAno2" name="Custo TO BE (Ano 2 Recorrente)" fill="#168821" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complexity & Shift Distributions */}
        <div className="space-y-6">
          <div className="br-card bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 m-0">Distribuição por Complexidade</h3>
                <p className="text-[11px] text-slate-500 m-0">Visão consolidada global</p>
              </div>
              <i className="fas fa-chart-pie text-slate-400 text-sm"></i>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={globalComplexidade}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={65}
                    paddingAngle={4}
                  >
                    {globalComplexidade.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_COMPLEXIDADE[index % COLORS_COMPLEXIDADE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0c326f', borderRadius: '4px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="br-card bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 m-0">Distribuição por Turno</h3>
                <p className="text-[11px] text-slate-500 m-0">
                  {selectedRegistroId
                    ? 'Turno do processo selecionado'
                    : 'Valores consolidados agrupados'}
                </p>
              </div>
              <i className="fas fa-clock text-slate-400 text-sm"></i>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribuicaoTurno}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={65}
                    paddingAngle={4}
                  >
                    {distribuicaoTurno.map((entry, index) => (
                      <Cell key={`cell-turno-${index}`} fill={COLORS_TURNO[index % COLORS_TURNO.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0c326f', borderRadius: '4px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Consolidada com Linhas Expansíveis & Filtros Avançados */}
      <div className="space-y-4">
        {/* Barra de Filtros Integrada */}
        <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <i className="fas fa-search absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              placeholder="Buscar por nome, ID ou área..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
            />
          </div>

          {/* Filter Area */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4]"
            >
              <option value="">Todas as Áreas</option>
              {uniqueAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Situação */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={situacaoFilter}
              onChange={(e) => setSituacaoFilter(e.target.value)}
              className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4]"
            >
              <option value="">Todas as Situações</option>
              <option value="Em levantamento">Em levantamento</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Em implantação">Em implantação</option>
              <option value="Concluído">Concluído</option>
              <option value="Descartado">Descartado</option>
            </select>
          </div>

          {/* Filter Complexidade */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={complexidadeFilter}
              onChange={(e) => setComplexidadeFilter(e.target.value)}
              className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4]"
            >
              <option value="">Todas as Complexidades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* Expand / Collapse All */}
          <button
            type="button"
            onClick={toggleExpandAll}
            className="w-full md:w-auto flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded border border-slate-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isAllExpanded ? (
              <>
                <i className="fas fa-compress text-slate-500 text-xs mr-1"></i>
                <span>Recolher Todos</span>
              </>
            ) : (
              <>
                <i className="fas fa-expand text-slate-500 text-xs mr-1"></i>
                <span>Expandir Todos</span>
              </>
            )}
          </button>
        </div>

        {/* Tabela de Dados */}
        <div className="br-table bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 m-0">Tabela Consolidada de Análise & Priorização</h3>
            <span className="text-[11px] text-slate-500">
              Exibindo {filteredAndSortedProcessos.length} de {data.comparativoProcessos.length} processos
            </span>
          </div>

          {/* Responsive Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-2 px-2.5 w-9 text-center"></th>
                  <th onClick={() => handleSort('idAnalise')} className="py-2 px-2.5 cursor-pointer hover:bg-slate-200/70 transition-colors">
                    ID {renderSortIcon('idAnalise')}
                  </th>
                  <th onClick={() => handleSort('nome')} className="py-2 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors">
                    Processo & Área {renderSortIcon('nome')}
                  </th>
                  <th onClick={() => handleSort('custoAtualMensal')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                    Custo Atual {renderSortIcon('custoAtualMensal')}
                  </th>
                  <th onClick={() => handleSort('fteLiberado')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                    FTE Liberado {renderSortIcon('fteLiberado')}
                  </th>
                  <th onClick={() => handleSort('complexidade')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                    Complexidade {renderSortIcon('complexidade')}
                  </th>
                  <th onClick={() => handleSort('roiAno1')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                    ROI 1 Ano {renderSortIcon('roiAno1')}
                  </th>
                  <th onClick={() => handleSort('paybackMeses')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                    Payback {renderSortIcon('paybackMeses')}
                  </th>
                  <th onClick={() => handleSort('situacao')} className="py-2 px-3 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                    Status {renderSortIcon('situacao')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-800 text-[11px]">
                {filteredAndSortedProcessos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-500 text-xs">
                      Nenhum registro encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedProcessos.map((proc) => {
                    const isSelected = selectedRegistroId === proc.id;
                    const isExpanded = expandedRows.has(proc.id);

                    return (
                      <React.Fragment key={proc.id}>
                        {/* Main Table Row */}
                        <tr
                          onClick={() => handleRowClick(proc.id)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            isSelected
                              ? 'bg-blue-50/70 font-semibold'
                              : 'hover:bg-slate-50'
                          } ${isExpanded ? 'border-b-0' : ''}`}
                          title={isSelected ? 'Clique para desmarcar foco' : 'Clique para focar este processo nos gráficos'}
                        >
                          {/* Expand Button */}
                          <td className="py-2.5 px-2.5 text-center">
                            <button
                              type="button"
                              onClick={(e) => toggleExpandRow(proc.id, e)}
                              className="p-1 rounded text-slate-400 hover:text-[#1351b4] hover:bg-blue-50/50 transition-colors cursor-pointer bg-transparent border-0 shadow-none"
                              title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes completos'}
                            >
                              <i className={`fas fa-chevron-${isExpanded ? 'down text-[#1351b4]' : 'right text-slate-400'} text-[10px]`}></i>
                            </button>
                          </td>

                          {/* ID */}
                          <td className="py-2.5 px-2.5 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-[#1351b4] text-[11px]">{proc.idAnalise}</span>
                              {proc.idOrigem && proc.idOrigem !== '-' && (
                                <span className="text-[9.5px] text-slate-400 font-mono">({proc.idOrigem})</span>
                              )}
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#1351b4] animate-pulse"></span>}
                            </div>
                          </td>

                          {/* Processo & Área */}
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900 text-[11px] leading-tight">{proc.nome}</div>
                            <div className="text-[10px] text-slate-500 font-normal">{proc.area}</div>
                          </td>

                          {/* Custo Atual */}
                          <td className="py-2.5 px-2.5 text-right font-medium text-red-700 whitespace-nowrap text-[11px]">
                            R$ {proc.custoAtualMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                          </td>

                          {/* FTE Liberado */}
                          <td className="py-2.5 px-2.5 text-right font-bold text-green-700 whitespace-nowrap text-[11px]">
                            {proc.fteLiberado} FTE
                          </td>

                          {/* Complexidade */}
                          <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9.5px] ${
                                proc.complexidade === 'Baixa'
                                  ? 'bg-green-100 text-green-800'
                                  : proc.complexidade === 'Média'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {proc.complexidade}
                            </span>
                          </td>

                          {/* ROI 1 Ano */}
                          <td className="py-2.5 px-2.5 text-right font-bold text-green-700 whitespace-nowrap text-[11px]">
                            R$ {proc.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>

                          {/* Payback */}
                          <td className="py-2.5 px-2.5 text-center font-medium text-slate-700 whitespace-nowrap text-[11px]">
                            {proc.paybackMeses.toFixed(1)} meses
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded font-medium text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                              {proc.situacao}
                            </span>
                          </td>
                        </tr>

                        {/* Expanded Sub-row Drawer */}
                        {isExpanded && (
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <td colSpan={9} className="p-4 sm:p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 1. Diagnóstico AS IS */}
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
                                  <div className="flex items-center space-x-2 text-red-700 font-bold text-xs pb-2 border-b border-slate-100">
                                    <i className="fas fa-file-alt text-xs"></i>
                                    <span>1. Diagnóstico AS IS (Situação Atual)</span>
                                  </div>
                                  <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Periodicidade:</span>
                                      <span className="font-semibold text-slate-800">{proc.periodicidade}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Perfil Executor:</span>
                                      <span className="font-semibold text-slate-800">{proc.perfilExecutor}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Tempo Execução:</span>
                                      <span className="font-semibold text-slate-800">{proc.tempoExecucao} h / mês</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Custo Atual Mensal:</span>
                                      <span className="font-bold text-red-600">R$ {proc.custoAtualMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="pt-1 border-t border-slate-100">
                                      <span className="text-slate-500 block mb-0.5">Sistemas Envolvidos:</span>
                                      <span className="font-medium text-slate-700 text-[10px] bg-slate-50 p-1.5 rounded block border border-slate-200">
                                        {proc.sistemasEnvolvidos || 'Não informado'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* 2. Solução TO BE */}
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
                                  <div className="flex items-center space-x-2 text-[#1351b4] font-bold text-xs pb-2 border-b border-slate-100">
                                    <i className="fas fa-microchip text-xs"></i>
                                    <span>2. Solução TO BE (Automação)</span>
                                  </div>
                                  <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Plataforma:</span>
                                      <span className="font-bold text-[#1351b4]">{proc.tipoPlataformaNome || 'Python & Robot Framework'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Complexidade:</span>
                                      <span className="font-semibold text-slate-800">{proc.complexidade}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Score de Benefícios:</span>
                                      <span className="font-bold text-[#1351b4]">{proc.pontuacaoBeneficios}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Redução de Tempo:</span>
                                      <span className="font-semibold text-green-700">{proc.reducaoTempoPrevista}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Redução de Custo:</span>
                                      <span className="font-semibold text-green-700">{proc.reducaoCustoPrevista}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">FTE Poupado:</span>
                                      <span className="font-bold text-green-700">{proc.fteLiberado} FTE</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Turno de Operação:</span>
                                      <span className="font-semibold text-slate-800">{proc.turno || 'Diurno'}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-slate-100">
                                      <span className="text-slate-500">Recomendação:</span>
                                      <span className="font-semibold text-slate-800">{proc.recomendacao}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* 3. Custos & Retorno (ROI) */}
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
                                  <div className="flex items-center space-x-2 text-green-800 font-bold text-xs pb-2 border-b border-slate-100">
                                    <i className="fas fa-coins text-xs"></i>
                                    <span>3. Custos & Projeções Financeiras</span>
                                  </div>
                                  <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Investimento Setup:</span>
                                      <span className="font-semibold text-slate-800">R$ {proc.investimentoSetup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Custo TO BE (Ano 1/mês):</span>
                                      <span className="font-semibold text-slate-800">R$ {proc.custoToBeMensalAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Custo TO BE (Ano 2/mês):</span>
                                      <span className="font-semibold text-slate-800">R$ {proc.custoToBeMensalAno2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Economia Mensal (Ano 1):</span>
                                      <span className="font-bold text-green-700">R$ {proc.economiaMensalAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-slate-100">
                                      <span className="text-slate-500">ROI Líquido (Ano 1):</span>
                                      <span className="font-bold text-green-700">R$ {proc.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">ROI Líquido (Ano 2):</span>
                                      <span className="font-bold text-green-800">R$ {proc.roiAno2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Payback Estimado:</span>
                                      <span className="font-bold text-amber-700">{proc.paybackMeses.toFixed(1)} meses</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

