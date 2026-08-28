import React, { useState, useEffect, useMemo } from 'react';
import { Registro, Parametro, MaturidadeNivel, ArquetipoTipo } from '../types';
import { api } from '../services/api';
import { RegistroFormModal } from '../components/RegistroFormModal';
import { DossieExportModal } from '../components/DossieExportModal';
import { useNotification } from '../components/Notification';

export const RegistrosPage: React.FC = () => {
  const notify = useNotification();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [parametro, setParametro] = useState<Parametro | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [situacaoFilter, setSituacaoFilter] = useState('');
  const [complexidadeFilter, setComplexidadeFilter] = useState('');
  const [maturidadeFilter, setMaturidadeFilter] = useState('');
  const [arquetipoFilter, setArquetipoFilter] = useState('');
  const [sortField, setSortField] = useState<string>('idAnalise');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<Registro | null>(null);
  const [dossieModalOpen, setDossieModalOpen] = useState(false);
  const [dossieRegistro, setDossieRegistro] = useState<Registro | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getRegistros({
        search: search || undefined,
        area: areaFilter || undefined,
        situacao: situacaoFilter || undefined,
        complexidade: complexidadeFilter || undefined,
        nivelMaturidade: maturidadeFilter || undefined,
        arquetipo: arquetipoFilter || undefined,
      });
      setRegistros(data);
    } catch (err: any) {
      console.error(err);
      notify.error('Erro de Carregamento', 'Erro ao carregar levantamentos de processos.');
    } finally {
      setLoading(false);
    }
  };

  const loadParametros = async () => {
    try {
      const p = await api.getParametros();
      setParametro(p);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    loadParametros();
  }, [search, areaFilter, situacaoFilter, complexidadeFilter, maturidadeFilter, arquetipoFilter]);

  const handleOpenCreate = () => {
    setEditingRegistro(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (registro: Registro) => {
    setEditingRegistro(registro);
    setModalOpen(true);
  };

  const handleSave = async (formData: Partial<Registro>) => {
    try {
      if (editingRegistro) {
        await api.updateRegistro(editingRegistro.id, formData);
        notify.success('Processo Atualizado', `Oportunidade "${formData.nomeProcesso}" atualizada com sucesso.`);
      } else {
        await api.createRegistro(formData);
        notify.success('Processo Cadastrado', `Nova oportunidade "${formData.nomeProcesso}" cadastrada.`);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      notify.error('Erro ao Salvar', err.message || 'Erro ao salvar oportunidade.');
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o levantamento "${nome}"?`)) {
      try {
        await api.deleteRegistro(id);
        notify.success('Processo Excluído', `Levantamento "${nome}" excluído com sucesso.`);
        loadData();
      } catch (err: any) {
        notify.error('Erro ao Excluir', err.message || 'Erro ao excluir.');
      }
    }
  };

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

  const uniqueAreas = useMemo(() => {
    return Array.from(new Set(registros.map((r) => r.area))).filter(Boolean);
  }, [registros]);

  const sortedRegistros = useMemo(() => {
    const list = [...registros];
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
  }, [registros, sortField, sortDirection]);

  const toggleExpandAll = () => {
    if (!sortedRegistros.length) return;
    if (expandedRows.size === sortedRegistros.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(sortedRegistros.map((r) => r.id)));
    }
  };

  const isAllExpanded = sortedRegistros.length > 0 && expandedRows.size === sortedRegistros.length;

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <i className="fas fa-sort text-slate-300 ml-1 text-[10px]"></i>;
    }
    return sortDirection === 'asc' ? (
      <i className="fas fa-sort-up text-[#1351b4] ml-1 text-[10px]"></i>
    ) : (
      <i className="fas fa-sort-down text-[#1351b4] ml-1 text-[10px]"></i>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com Identidade GOVBR DS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--govbr-blue-warm-vivid-90)] tracking-tight">
            Portfólio de Oportunidades de Automação
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão de esteira, triagem de maturidade (N0 a N3), arquétipos de valor e análise de viabilidade corporativa.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white font-bold text-xs rounded-md shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap"
        >
          <i className="fas fa-plus text-xs"></i>
          <span>Nova Oportunidade (N0)</span>
        </button>
      </div>

      {/* Barra de Filtros GOVBR DS */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] w-full">
          <input
            type="text"
            placeholder="Buscar por processo, ID, área, dor ou plataforma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-md pl-8 pr-3 py-2 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#1351b4]"
          />
          <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        </div>

        {/* Filter Maturidade */}
        <div className="w-full md:w-auto">
          <select
            value={maturidadeFilter}
            onChange={(e) => setMaturidadeFilter(e.target.value)}
            className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4] font-medium"
          >
            <option value="">Todos os Níveis de Maturidade</option>
            <option value="N0">N0 — Oportunidade (Dor Registrada)</option>
            <option value="N1">N1 — Business Case Parcial</option>
            <option value="N2">N2 — Business Case Completo</option>
            <option value="N3">N3 — Benefício Realizado</option>
          </select>
        </div>

        {/* Filter Arquétipo */}
        <div className="w-full md:w-auto">
          <select
            value={arquetipoFilter}
            onChange={(e) => setArquetipoFilter(e.target.value)}
            className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4]"
          >
            <option value="">Todos os 7 Arquétipos</option>
            <option value="A1">A1 — Transacional Repetitivo (Horas)</option>
            <option value="A2">A2 — Erro e Retrabalho (Perdas)</option>
            <option value="A3">A3 — Atendimento e Autosserviço (SAC)</option>
            <option value="A4">A4 — Conformidade e Risco (Multas/Glosas)</option>
            <option value="A5">A5 — Gargalo e Ciclo de Receita</option>
            <option value="A6">A6 — Racionalização Técnica (Robôs)</option>
            <option value="A7">A7 — Processo Comercial (Receita)</option>
          </select>
        </div>

        {/* Filter Área */}
        <div className="w-full md:w-auto">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4]"
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
        <div className="w-full md:w-auto">
          <select
            value={situacaoFilter}
            onChange={(e) => setSituacaoFilter(e.target.value)}
            className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4]"
          >
            <option value="">Todas as Situações</option>
            <option value="Em levantamento">Em levantamento</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Em implantação">Em implantação</option>
            <option value="Concluído">Concluído</option>
            <option value="Descartado">Descartado</option>
          </select>
        </div>

        {/* Expand / Collapse All */}
        <button
          type="button"
          onClick={toggleExpandAll}
          className="w-full md:w-auto flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-md border border-slate-300 transition-colors cursor-pointer whitespace-nowrap"
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

      {/* Table (Master-Detail Inline com padrão GOV.BR DS) */}
      <div className="br-table bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2 px-2.5 w-8 text-center"></th>
                <th onClick={() => handleSort('idAnalise')} className="py-2 px-2.5 cursor-pointer hover:bg-slate-200/70 transition-colors">
                  ID {renderSortIcon('idAnalise')}
                </th>
                <th onClick={() => handleSort('nomeProcesso')} className="py-2 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Processo & Maturidade {renderSortIcon('nomeProcesso')}
                </th>
                <th onClick={() => handleSort('arquetipoPrimario')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Arquétipo {renderSortIcon('arquetipoPrimario')}
                </th>
                <th onClick={() => handleSort('beneficioLiquidoAnual')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Benefício Anual {renderSortIcon('beneficioLiquidoAnual')}
                </th>
                <th onClick={() => handleSort('vpl3Anos')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  VPL (3 Anos) {renderSortIcon('vpl3Anos')}
                </th>
                <th onClick={() => handleSort('fteLiberado')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  FTEs {renderSortIcon('fteLiberado')}
                </th>
                <th onClick={() => handleSort('paybackMeses')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Payback {renderSortIcon('paybackMeses')}
                </th>
                <th onClick={() => handleSort('situacao')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Status {renderSortIcon('situacao')}
                </th>
                <th className="py-2 px-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-800 text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1351b4]"></div>
                    <p className="mt-2 text-xs">Carregando oportunidades...</p>
                  </td>
                </tr>
              ) : sortedRegistros.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-500 text-xs">
                    Nenhum levantamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                sortedRegistros.map((item) => {
                  const isExpanded = expandedRows.has(item.id);
                  const mat = item.nivelMaturidade || 'N0';

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => toggleExpandRow(item.id)}
                        className={`cursor-pointer transition-colors duration-150 hover:bg-slate-50 ${
                          isExpanded ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        {/* Chevron */}
                        <td className="py-2.5 px-2.5 text-center">
                          <button
                            type="button"
                            onClick={(e) => toggleExpandRow(item.id, e)}
                            className="p-1 rounded text-slate-400 hover:text-[#1351b4] hover:bg-blue-50/50 transition-colors bg-transparent border-0 shadow-none cursor-pointer"
                            aria-label="Expandir detalhes"
                          >
                            <i className={`fas fa-chevron-${isExpanded ? 'down text-[#1351b4]' : 'right text-slate-400'} text-[10px]`}></i>
                          </button>
                        </td>

                        {/* ID */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <span className="font-bold text-[#1351b4] text-[11px]">{item.idAnalise}</span>
                        </td>

                        {/* Processo & Maturidade */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${
                                mat === 'N0'
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : mat === 'N1'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : mat === 'N2'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-purple-100 text-purple-900 border-purple-300'
                              }`}
                            >
                              {mat}
                            </span>
                            <span className="font-semibold text-slate-900 text-[11px] leading-tight">{item.nomeProcesso}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5">{item.area}</div>
                        </td>

                        {/* Arquétipo */}
                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                            {item.arquetipoPrimario || 'A1'}
                          </span>
                        </td>

                        {/* Benefício Anual */}
                        <td className="py-2.5 px-2.5 text-right font-bold text-emerald-700 whitespace-nowrap text-[11px]">
                          {(item.beneficioLiquidoAnual || (item.custoMensalAtual ? item.custoMensalAtual * 12 : 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>

                        {/* VPL 3 Anos */}
                        <td className="py-2.5 px-2.5 text-right font-bold text-cyan-800 whitespace-nowrap text-[11px]">
                          {(item.vpl3Anos || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>

                        {/* FTE Liberado */}
                        <td className="py-2.5 px-2.5 text-right font-bold text-blue-800 whitespace-nowrap text-[11px]">
                          {item.fteLiberado} FTE
                        </td>

                        {/* Payback */}
                        <td className="py-2.5 px-2.5 text-center font-medium text-slate-700 whitespace-nowrap text-[11px]">
                          {item.paybackMeses ? `${item.paybackMeses.toFixed(1)} m` : '-'}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded font-medium text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                            {item.situacao}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setDossieRegistro(item);
                                setDossieModalOpen(true);
                              }}
                              className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Visualizar / Imprimir Dossiê Executivo (PDF)"
                            >
                              <i className="fas fa-file-invoice-dollar text-xs"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-slate-600 hover:text-[#1351b4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Editar Oportunidade"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.nomeProcesso)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Excluir Oportunidade"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Sub-row Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <td colSpan={10} className="p-4 sm:p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* 1. Diagnóstico & Maturidade */}
                              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                                <div className="flex items-center space-x-2 text-[var(--govbr-blue-warm-vivid-90)] font-bold text-xs pb-1.5 border-b border-slate-100">
                                  <i className="fas fa-info-circle text-xs"></i>
                                  <span>1. Maturidade & Triagem Qualitativa</span>
                                </div>
                                <div className="space-y-1.5 text-[11px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Maturidade:</span>
                                    <span className="font-bold text-[#1351b4]">Nível {mat}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Criticidade:</span>
                                    <span className="font-semibold text-slate-800">{item.criticidadePercebida || 'Média'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Recorrência da Dor:</span>
                                    <span className="font-semibold text-slate-800">{item.recorrenciaDor || 'Frequente'}</span>
                                  </div>
                                  {item.sintomasDor && (
                                    <div className="pt-1 text-[10.5px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200">
                                      <strong>Sintomas:</strong> {item.sintomasDor}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 2. Trilha & Reuso */}
                              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                                <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs pb-1.5 border-b border-slate-100">
                                  <i className="fas fa-layer-group text-xs"></i>
                                  <span>2. Atribuição de Trilha & Reuso</span>
                                </div>
                                <div className="space-y-1.5 text-[11px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Trilha Automação:</span>
                                    <span className="font-bold text-emerald-700">{((item.percTrilhaAutomacao ?? 1.0) * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Trilha Processo / Sistema:</span>
                                    <span className="font-medium text-slate-700">
                                      {((item.percTrilhaProcesso ?? 0) * 100).toFixed(0)}% / {((item.percTrilhaSistema ?? 0) * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Unidades Piloto vs Escala:</span>
                                    <span className="font-semibold text-slate-800">{item.unidadesPiloto ?? 1} / {item.unidadesPotenciais ?? 1} unid.</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Potencial em Escala:</span>
                                    <span className="font-bold text-blue-800">
                                      {(item.beneficioPotencialEscala || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* 3. Projeção Financeira & Cenários */}
                              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-2">
                                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs pb-1.5 border-b border-slate-100">
                                  <i className="fas fa-chart-line text-xs"></i>
                                  <span>3. Engenharia Financeira & VPL</span>
                                </div>
                                <div className="space-y-1.5 text-[11px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">VPL Base (3 Anos):</span>
                                    <span className="font-bold text-cyan-800">{(item.vpl3Anos || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">VPL Cenário Conservador:</span>
                                    <span className="font-medium text-slate-700">{(item.vplCenarioConservador || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">VPL Cenário Otimista:</span>
                                    <span className="font-medium text-emerald-700">{(item.vplCenarioOtimista || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Score Intangível (12 Critérios):</span>
                                    <span className="font-bold text-purple-800">{((item.pontuacaoBeneficios || 0) * 100).toFixed(1)}%</span>
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

      {/* Modal de Formulário */}
      <RegistroFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingRegistro}
        parametro={parametro}
        onSave={handleSave}
      />

      {/* Modal de Dossiê Executivo (PDF) */}
      <DossieExportModal
        isOpen={dossieModalOpen}
        onClose={() => setDossieModalOpen(false)}
        registro={dossieRegistro}
        parametro={parametro}
      />
    </div>
  );
};
