import React, { useState, useEffect, useMemo } from 'react';
import { AnalyticsResumo } from '../types';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  Layers,
  PieChart as PieIcon,
  BarChart3,
  Filter,
  Search,
  CheckCircle2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Cpu,
  Coins,
} from 'lucide-react';
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

  const COLORS_COMPLEXIDADE = ['#10b981', '#f59e0b', '#ef4444'];
  const COLORS_TURNO = ['#0c85eb', '#8b5cf6', '#ec4899'];

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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <p className="font-semibold">Erro ao carregar dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={() => loadData()}
          className="mt-3 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { kpis, distribuicaoTurno, todosProcessosDisponiveis, isSpecificRecord } = data;

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 inline ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-brand-600 inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-600 inline ml-1" />
    );
  };

  const isAllExpanded = filteredAndSortedProcessos.length > 0 && expandedRows.size === filteredAndSortedProcessos.length;

  return (
    <div className="space-y-8">
      {/* Top Header & Scope Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Painel Executivo & Análise de Viabilidade</h1>
            {isSpecificRecord && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                <span>Foco: {data.selectedRecord?.idAnalise} - {data.selectedRecord?.nomeProcesso}</span>
                <button
                  onClick={() => setSelectedRegistroId('')}
                  className="ml-1 text-purple-600 hover:text-purple-900"
                  title="Limpar foco e ver todos"
                >
                  <RotateCcw className="w-3 h-3 inline" />
                </button>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Consolidação de ganhos financeiros, FTE liberável, matriz de benefícios e payback para oportunidades de automação.
          </p>
        </div>

        {/* Scope Dropdown */}
        <div className="flex items-center space-x-2 self-start sm:self-auto bg-slate-50 p-2 rounded-xl border border-slate-200">
          <Filter className="w-4 h-4 text-slate-500 ml-1" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Escopo da Análise:</span>
          <select
            value={selectedRegistroId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedRegistroId(val);
              if (val) {
                setExpandedRows((prev) => new Set(prev).add(val));
              }
            }}
            className="text-xs font-medium bg-white text-slate-800 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none cursor-pointer"
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
          icon={Layers}
          colorScheme="blue"
        />
        <StatCard
          title="FTE Total Liberável"
          value={`${kpis.totalFteLiberado} FTE`}
          subtitle="Equivalente em horas homem poupadas"
          icon={Users}
          colorScheme="emerald"
        />
        <StatCard
          title="ROI Anual (Ano 1)"
          value={`R$ ${kpis.roiAno1Total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="Economia líquida após setup"
          icon={TrendingUp}
          colorScheme="violet"
        />
        <StatCard
          title="Payback Médio"
          value={`${kpis.paybackMedio} meses`}
          subtitle={`Retorno no 2º ano: R$ ${kpis.roiAno2Total.toLocaleString('pt-BR')}`}
          icon={Clock}
          colorScheme="amber"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Custo Atual (AS IS) Mensal</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              R$ {kpis.custoAtualMensalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Custo Automatizado (TO BE) Ano 1/mês</span>
            <div className="text-lg font-bold text-cyan-600 mt-0.5">
              R$ {kpis.custoMensalAno1Total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Pontuação Média de Benefícios</span>
            <div className="text-lg font-bold text-brand-600 mt-0.5">
              {kpis.pontuacaoMediaPercent}%
            </div>
          </div>
          <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Comparativo de Custos Mensais: AS IS vs TO BE</h3>
              <p className="text-xs text-slate-500">
                {selectedRegistroId
                  ? 'Custo individual do processo selecionado (R$/Mês)'
                  : 'Valores consolidados agrupados de todos os processos (R$/Mês)'}
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="idAnalise" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `R$${val / 1000}k`} />
                <Tooltip
                  formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="custoAtualMensal" name="Custo Manual Atual (AS IS)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custoToBeMensalAno1" name="Custo TO BE (Ano 1 com Setup)" fill="#0c85eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="custoToBeMensalAno2" name="Custo TO BE (Ano 2 Recorrente)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complexity & Shift Distributions */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Distribuição por Complexidade</h3>
                <p className="text-[11px] text-slate-500">Visão consolidada global de todos os processos</p>
              </div>
              <PieIcon className="w-4 h-4 text-slate-400" />
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
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Distribuição por Turno de Execução</h3>
                <p className="text-[11px] text-slate-500">
                  {selectedRegistroId
                    ? 'Turno do processo selecionado'
                    : 'Valores consolidados agrupados de todos os processos'}
                </p>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
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
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff' }} />
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
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, ID ou área..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
            />
          </div>

          {/* Filter Area */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full md:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
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
              className="w-full md:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
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
              className="w-full md:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Todas as Complexidades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* Expand / Collapse All */}
          <button
            onClick={toggleExpandAll}
            className="w-full md:w-auto flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-xs transition-all whitespace-nowrap"
          >
            {isAllExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Recolher Todos</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Expandir Todos</span>
              </>
            )}
          </button>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Tabela Consolidada de Análise & Priorização</h3>
            <span className="text-[11px] text-slate-500">
              Exibindo {filteredAndSortedProcessos.length} de {data.comparativoProcessos.length} processos
            </span>
          </div>

          {/* Responsive Table without Horizontal Scroll */}
          <div className="w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                  <th className="py-3 px-3 w-10 text-center"></th>
                  <th onClick={() => handleSort('idAnalise')} className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors">
                    ID {renderSortIcon('idAnalise')}
                  </th>
                  <th onClick={() => handleSort('nome')} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                    Processo & Área {renderSortIcon('nome')}
                  </th>
                  <th onClick={() => handleSort('custoAtualMensal')} className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors">
                    Custo Atual {renderSortIcon('custoAtualMensal')}
                  </th>
                  <th onClick={() => handleSort('fteLiberado')} className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors">
                    FTE Liberado {renderSortIcon('fteLiberado')}
                  </th>
                  <th onClick={() => handleSort('complexidade')} className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/60 transition-colors">
                    Complexidade {renderSortIcon('complexidade')}
                  </th>
                  <th onClick={() => handleSort('roiAno1')} className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors">
                    ROI 1 Ano {renderSortIcon('roiAno1')}
                  </th>
                  <th onClick={() => handleSort('paybackMeses')} className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/60 transition-colors">
                    Payback {renderSortIcon('paybackMeses')}
                  </th>
                  <th onClick={() => handleSort('situacao')} className="py-3 px-4 text-center cursor-pointer hover:bg-slate-200/60 transition-colors">
                    Status {renderSortIcon('situacao')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-800">
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
                          className={`cursor-pointer transition-all duration-150 ${
                            isSelected
                              ? 'bg-brand-50/90 font-semibold'
                              : 'hover:bg-slate-50/90'
                          } ${isExpanded ? 'border-b-0' : ''}`}
                          title={isSelected ? 'Clique para desmarcar foco' : 'Clique para focar este processo nos gráficos'}
                        >
                          {/* Expand Button */}
                          <td className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => toggleExpandRow(proc.id, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                              title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes completos'}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-brand-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          {/* ID */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-extrabold text-brand-600">{proc.idAnalise}</span>
                              {proc.idOrigem && proc.idOrigem !== '-' && (
                                <span className="text-[10px] text-slate-400 font-mono">({proc.idOrigem})</span>
                              )}
                              {isSelected && <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>}
                            </div>
                          </td>

                          {/* Processo & Área */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-xs">{proc.nome}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{proc.area}</div>
                          </td>

                          {/* Custo Atual */}
                          <td className="py-3.5 px-3 text-right font-semibold text-rose-700 whitespace-nowrap">
                            R$ {proc.custoAtualMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                          </td>

                          {/* FTE Liberado */}
                          <td className="py-3.5 px-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                            {proc.fteLiberado} FTE
                          </td>

                          {/* Complexidade */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                proc.complexidade === 'Baixa'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : proc.complexidade === 'Média'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {proc.complexidade}
                            </span>
                          </td>

                          {/* ROI 1 Ano */}
                          <td className="py-3.5 px-3 text-right font-bold text-emerald-600 whitespace-nowrap">
                            R$ {proc.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>

                          {/* Payback */}
                          <td className="py-3.5 px-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                            {proc.paybackMeses.toFixed(1)} meses
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md font-medium text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                              {proc.situacao}
                            </span>
                          </td>
                        </tr>

                        {/* Expanded Sub-row Drawer */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80 border-b border-slate-200">
                            <td colSpan={9} className="p-4 sm:p-6 animate-fade-in">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 1. Diagnóstico AS IS */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs pb-2 border-b border-slate-100">
                                    <FileText className="w-4 h-4" />
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
                                      <span className="font-bold text-rose-600">R$ {proc.custoAtualMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="pt-1 border-t border-slate-50">
                                      <span className="text-slate-500 block mb-0.5">Sistemas Envolvidos:</span>
                                      <span className="font-medium text-slate-700 text-[10px] bg-slate-50 p-1.5 rounded block border border-slate-100">
                                        {proc.sistemasEnvolvidos || 'Não informado'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* 2. Solução TO BE */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                                  <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs pb-2 border-b border-slate-100">
                                    <Cpu className="w-4 h-4" />
                                    <span>2. Solução TO BE (Automação)</span>
                                  </div>
                                  <div className="space-y-2 text-[11px]">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Plataforma:</span>
                                      <span className="font-bold text-brand-700">{proc.tipoPlataformaNome || 'Python & Robot Framework'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Complexidade:</span>
                                      <span className="font-semibold text-slate-800">{proc.complexidade}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Score de Benefícios:</span>
                                      <span className="font-bold text-brand-600">{proc.pontuacaoBeneficios}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Redução de Tempo:</span>
                                      <span className="font-semibold text-emerald-600">{proc.reducaoTempoPrevista}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Redução de Custo:</span>
                                      <span className="font-semibold text-emerald-600">{proc.reducaoCustoPrevista}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">FTE Poupado:</span>
                                      <span className="font-bold text-emerald-600">{proc.fteLiberado} FTE</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Turno de Operação:</span>
                                      <span className="font-semibold text-slate-800">{proc.turno || 'Diurno'}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-slate-50">
                                      <span className="text-slate-500">Recomendação:</span>
                                      <span className="font-semibold text-slate-800">{proc.recomendacao}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* 3. Custos & Retorno (ROI) */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                                  <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs pb-2 border-b border-slate-100">
                                    <Coins className="w-4 h-4" />
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
                                      <span className="font-bold text-emerald-600">R$ {proc.economiaMensalAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-slate-50">
                                      <span className="text-slate-500">ROI Líquido (Ano 1):</span>
                                      <span className="font-bold text-emerald-600">R$ {proc.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">ROI Líquido (Ano 2):</span>
                                      <span className="font-bold text-emerald-700">R$ {proc.roiAno2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Payback Estimado:</span>
                                      <span className="font-bold text-amber-600">{proc.paybackMeses.toFixed(1)} meses</span>
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
