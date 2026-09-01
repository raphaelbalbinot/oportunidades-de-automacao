import React, { useState, useEffect, useMemo } from 'react';
import { Registro, Parametro, MaturidadeNivel, ArquetipoTipo } from '../types';
import { api } from '../services/api';
import { RegistroFormModal } from '../components/RegistroFormModal';
import { DossieExportModal } from '../components/DossieExportModal';
import { useNotification } from '../components/Notification';

const HeaderInfoTooltip: React.FC<{
  title: string;
  description: string;
  formula?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ title, description, formula, align = 'center' }) => {
  const [show, setShow] = useState(false);

  const positionClasses =
    align === 'left'
      ? 'top-full left-0 mt-2'
      : align === 'right'
      ? 'top-full right-0 mt-2'
      : 'top-full left-1/2 -translate-x-1/2 mt-2';

  return (
    <div
      className="relative inline-flex items-center ml-1 text-slate-400 hover:text-[#1351b4]"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        className="p-0.5 bg-transparent border-0 shadow-none cursor-pointer inline-flex items-center text-slate-400 hover:text-[#1351b4]"
        aria-label={`Ajuda sobre ${title}`}
      >
        <i className="fas fa-info-circle text-[10.5px]"></i>
      </button>
      {show && (
        <div
          className={`absolute z-[100] ${positionClasses} w-64 p-3 bg-[#0f172a] text-white text-[11px] rounded-lg shadow-2xl border border-slate-700 text-left normal-case font-normal leading-tight pointer-events-none`}
        >
          <div className="font-bold text-blue-300 text-[11.5px] mb-1 flex items-center space-x-1.5">
            <i className="fas fa-lightbulb text-amber-400 text-[11px]"></i>
            <span>{title}</span>
          </div>
          <p className="m-0 text-slate-200 leading-relaxed">{description}</p>
          {formula && (
            <div className="mt-2 pt-1.5 border-t border-slate-700/80 text-[10px] text-emerald-300 font-mono">
              <strong className="text-slate-400 font-sans">Fórmula:</strong> {formula}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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

  useEffect(() => {
    loadData();
    api.getParametros().then(setParametro).catch(console.error);
  }, [search, areaFilter, situacaoFilter, complexidadeFilter, maturidadeFilter, arquetipoFilter]);

  const handleOpenCreate = () => {
    setEditingRegistro(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (registro: Registro) => {
    setEditingRegistro(registro);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, nomeProcesso: string) => {
    if (confirm(`Deseja realmente excluir a oportunidade "${nomeProcesso}"?`)) {
      try {
        await api.deleteRegistro(id);
        notify.success('Oportunidade Excluída', `Oportunidade "${nomeProcesso}" excluída com sucesso.`);
        loadData();
      } catch (err: any) {
        console.error(err);
        notify.error('Erro ao Excluir', 'Não foi possível excluir a oportunidade.');
      }
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1351b4] tracking-tight">
            Levantamento de Oportunidades & Business Cases
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventário unificado de automações com cálculo auditável de ROI, VPL, maturidade e benefícios estratégicos.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleExpandAll}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer transition-colors flex items-center space-x-1.5"
            title={isAllExpanded ? 'Recolher todos os detalhes' : 'Expandir todos os detalhes'}
          >
            <i className={`fas fa-${isAllExpanded ? 'compress-alt' : 'expand-alt'} text-slate-600 text-xs`}></i>
            <span>{isAllExpanded ? 'Recolher Tudo' : 'Expandir Tudo'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1351b4] hover:bg-[#0c326f] rounded shadow-xs hover:shadow cursor-pointer transition-all flex items-center space-x-2"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros Rápidos */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          {/* Busca Texto */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Buscar Processo / ID / Sistemas</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Folha, DAP, SEI, A1..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
              <i className="fas fa-search absolute left-2.5 top-2.5 text-slate-400 text-xs"></i>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
          </div>

          {/* Área Solicitante */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Área Cliente</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white"
            >
              <option value="">Todas as Áreas</option>
              {uniqueAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Funil de Maturidade */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Maturidade (FCAIA)</label>
            <select
              value={maturidadeFilter}
              onChange={(e) => setMaturidadeFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white font-medium"
            >
              <option value="">Todos os Níveis</option>
              <option value="N0">N0 — Ideação / Oportunidade</option>
              <option value="N1">N1 — Quantificação Básica</option>
              <option value="N2">N2 — Business Case Pronto</option>
              <option value="N3">N3 — Benefício Realizado</option>
            </select>
          </div>

          {/* Arquétipo Primário */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">7 Arquétipos</label>
            <select
              value={arquetipoFilter}
              onChange={(e) => setArquetipoFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white"
            >
              <option value="">Todos os Arquétipos</option>
              <option value="A1">A1 — HH Liberadas</option>
              <option value="A2">A2 — Mitigação de Erros</option>
              <option value="A3">A3 — Contatos / SAC</option>
              <option value="A4">A4 — Mitigação de Risco</option>
              <option value="A5">A5 — Lead Time / SLA</option>
              <option value="A6">A6 — Racionalização TI</option>
              <option value="A7">A7 — Novas Receitas</option>
            </select>
          </div>

          {/* Situação / Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status Esteira</label>
            <select
              value={situacaoFilter}
              onChange={(e) => setSituacaoFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white"
            >
              <option value="">Todos os Status</option>
              <option value="Em levantamento">Em levantamento</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Em implantação">Em implantação</option>
              <option value="Concluído">Concluído</option>
              <option value="Descartado">Descartado</option>
            </select>
          </div>
        </div>

        {/* Badges de Filtros Ativos */}
        {(search || areaFilter || situacaoFilter || complexidadeFilter || maturidadeFilter || arquetipoFilter) && (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Filtros ativos:</span>
            {search && <span className="bg-blue-50 text-[#1351b4] px-2 py-0.5 rounded text-[11px]">Busca: "{search}"</span>}
            {areaFilter && <span className="bg-blue-50 text-[#1351b4] px-2 py-0.5 rounded text-[11px]">Área: {areaFilter}</span>}
            {maturidadeFilter && <span className="bg-blue-50 text-[#1351b4] px-2 py-0.5 rounded text-[11px]">Maturidade: {maturidadeFilter}</span>}
            {arquetipoFilter && <span className="bg-blue-50 text-[#1351b4] px-2 py-0.5 rounded text-[11px]">Arquétipo: {arquetipoFilter}</span>}
            {situacaoFilter && <span className="bg-blue-50 text-[#1351b4] px-2 py-0.5 rounded text-[11px]">Status: {situacaoFilter}</span>}
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setAreaFilter('');
                setMaturidadeFilter('');
                setArquetipoFilter('');
                setSituacaoFilter('');
                setComplexidadeFilter('');
              }}
              className="text-red-600 hover:text-red-800 font-semibold text-[11px] underline cursor-pointer ml-2"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      {/* Table (Master-Detail Inline com padrão GOV.BR DS) */}
      <div className="br-table bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-2 px-2.5 w-8 text-center"></th>
                <th onClick={() => handleSort('idAnalise')} className="py-2 px-2.5 cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center space-x-0.5">
                    <span>ID</span>
                    {renderSortIcon('idAnalise')}
                    <HeaderInfoTooltip align="left" title="ID da Oportunidade" description="Identificador único da demanda no inventário da esteira de automação." />
                  </div>
                </th>
                <th onClick={() => handleSort('nomeProcesso')} className="py-2 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center space-x-0.5">
                    <span>Processo & Maturidade</span>
                    {renderSortIcon('nomeProcesso')}
                    <HeaderInfoTooltip align="left" title="Processo & Nível de Maturidade" description="Nível na esteira: N0 (Ideação preliminar), N1 (Quantificação básica), N2 (Business Case pronto para priorização) ou N3 (Em produção com benefício realizado)." />
                  </div>
                </th>
                <th onClick={() => handleSort('arquetipoPrimario')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-center space-x-0.5">
                    <span>Arquétipo</span>
                    {renderSortIcon('arquetipoPrimario')}
                    <HeaderInfoTooltip align="left" title="Arquétipo Financeiro (A1 a A7)" description="Modelo de mensuração de valor: A1 (HH Liberadas), A2 (Erro/Retrabalho), A3 (SAC/Contatos), A4 (Risco/Multas), A5 (Lead Time), A6 (Racionalização TI), A7 (Novas Receitas)." />
                  </div>
                </th>
                <th onClick={() => handleSort('pontuacaoBeneficios')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-center space-x-0.5">
                    <span>Intangíveis</span>
                    {renderSortIcon('pontuacaoBeneficios')}
                    <HeaderInfoTooltip align="center" title="Score de Benefícios Intangíveis (0% a 100%)" description="Aderência aos 12 critérios corporativos: LGPD, Segurança, Compliance, Mitigação de Key-Person Risk, SLA, Experiência do Cliente e ESG." />
                  </div>
                </th>
                <th onClick={() => handleSort('scorePriorizacao')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-center space-x-0.5">
                    <span>Score Prioriz.</span>
                    {renderSortIcon('scorePriorizacao')}
                    <HeaderInfoTooltip align="center" title="Score Composto de Priorização (0 a 100)" description="Nota unificada para rankeamento da esteira corporativa." formula="40% VPL + 30% Intangíveis + 30% Payback" />
                  </div>
                </th>
                <th onClick={() => handleSort('beneficioLiquidoAnual')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-end space-x-0.5">
                    <span>Benefício Anual</span>
                    {renderSortIcon('beneficioLiquidoAnual')}
                    <HeaderInfoTooltip align="right" title="Benefício Líquido Anual (R$)" description="Retorno financeiro líquido anual estimado após descontar custos de sustentação." />
                  </div>
                </th>
                <th onClick={() => handleSort('vpl3Anos')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-end space-x-0.5">
                    <span>VPL (3 Anos)</span>
                    {renderSortIcon('vpl3Anos')}
                    <HeaderInfoTooltip align="right" title="Valor Presente Líquido Trienal" description="Valor presente do fluxo de caixa líquido descontado à taxa Serpro (11,25% a.a.) no horizonte de 36 meses." />
                  </div>
                </th>
                <th onClick={() => handleSort('fteLiberado')} className="py-2 px-2.5 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-end space-x-0.5">
                    <span>FTEs</span>
                    {renderSortIcon('fteLiberado')}
                    <HeaderInfoTooltip align="right" title="Equivalente FTE Liberado" description="Capacidade de trabalho humano liberada para atividades de maior valor (1 FTE = 160h/mês)." />
                  </div>
                </th>
                <th onClick={() => handleSort('paybackMeses')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-center space-x-0.5">
                    <span>Payback</span>
                    {renderSortIcon('paybackMeses')}
                    <HeaderInfoTooltip align="right" title="Prazo de Retorno do Investimento" description="Tempo necessário em meses de operação para amortizar integralmente o custo de engenharia de setup." />
                  </div>
                </th>
                <th onClick={() => handleSort('situacao')} className="py-2 px-2.5 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  <div className="flex items-center justify-center space-x-0.5">
                    <span>Status</span>
                    {renderSortIcon('situacao')}
                    <HeaderInfoTooltip align="right" title="Situação do Ciclo de Vida" description="Estágio atual: Em levantamento, Aprovado (priorizado), Em implantação, Concluído ou Descartado." />
                  </div>
                </th>
                <th className="py-2 px-3 text-center">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-800 text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1351b4]"></div>
                    <p className="mt-2 text-xs">Carregando oportunidades...</p>
                  </td>
                </tr>
              ) : sortedRegistros.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-10 text-center text-slate-500 text-xs">
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

                        {/* Score Intangível */}
                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                          {(() => {
                            const raw = item.pontuacaoBeneficios || 0;
                            const score = raw > 1 ? raw : raw * 100;
                            return (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                                score >= 70
                                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                                  : score >= 40
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}>
                                <i className="fas fa-award mr-1 text-[9px] opacity-75"></i>
                                {score.toFixed(1)}%
                              </span>
                            );
                          })()}
                        </td>

                        {/* Score Priorização */}
                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                          {(() => {
                            const score = item.scorePriorizacao ?? 0;
                            return (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                                score >= 70
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : score >= 45
                                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}>
                                <i className="fas fa-star mr-1 text-[9px] text-amber-500"></i>
                                {score.toFixed(1)} pts
                              </span>
                            );
                          })()}
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
                          <td colSpan={12} className="p-4 sm:p-5">
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
