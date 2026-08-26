import React, { useState, useEffect, useMemo } from 'react';
import { Registro, Parametro } from '../types';
import { api } from '../services/api';
import { RegistroFormModal } from '../components/RegistroFormModal';

export const RegistrosPage: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [parametro, setParametro] = useState<Parametro | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [situacaoFilter, setSituacaoFilter] = useState('');
  const [complexidadeFilter, setComplexidadeFilter] = useState('');
  const [sortField, setSortField] = useState<string>('idAnalise');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<Registro | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getRegistros({
        search: search || undefined,
        area: areaFilter || undefined,
        situacao: situacaoFilter || undefined,
        complexidade: complexidadeFilter || undefined,
      });
      setRegistros(data);
    } catch (err: any) {
      console.error(err);
      alert('Erro ao carregar levantamentos.');
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
  }, [search, areaFilter, situacaoFilter, complexidadeFilter]);

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
      } else {
        await api.createRegistro(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar oportunidade.');
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o levantamento "${nome}"?`)) {
      try {
        await api.deleteRegistro(id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir.');
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
      return <i className="fas fa-sort text-slate-300 ml-1 text-xs"></i>;
    }
    return sortDirection === 'asc' ? (
      <i className="fas fa-sort-up text-[#1351b4] ml-1 text-xs"></i>
    ) : (
      <i className="fas fa-sort-down text-[#1351b4] ml-1 text-xs"></i>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="br-card bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Levantamento de Processos Operacionais</h2>
          <p className="text-xs text-slate-600 mt-1 m-0">
            Cadastro detalhado, dimensionamento AS IS, matriz de benefícios e projeção financeira TO BE para automação.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1351b4] hover:bg-[#0c326f] text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="br-card bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <i className="fas fa-search absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            placeholder="Buscar por nome, ID ou área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:border-[#1351b4] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Area */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
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
        <div className="flex items-center space-x-2 w-full md:w-auto">
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

        {/* Filter Complexidade */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={complexidadeFilter}
            onChange={(e) => setComplexidadeFilter(e.target.value)}
            className="w-full md:w-auto text-xs bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-700 outline-none cursor-pointer focus:border-[#1351b4]"
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
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center"></th>
                <th onClick={() => handleSort('idAnalise')} className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors">
                  ID {renderSortIcon('idAnalise')}
                </th>
                <th onClick={() => handleSort('nomeProcesso')} className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Processo & Área {renderSortIcon('nomeProcesso')}
                </th>
                <th onClick={() => handleSort('custoMensalAtual')} className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Custo Atual {renderSortIcon('custoMensalAtual')}
                </th>
                <th onClick={() => handleSort('fteLiberado')} className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  FTE Liberado {renderSortIcon('fteLiberado')}
                </th>
                <th onClick={() => handleSort('complexidade')} className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Complexidade {renderSortIcon('complexidade')}
                </th>
                <th onClick={() => handleSort('roiAno1')} className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/70 transition-colors">
                  ROI 1 Ano {renderSortIcon('roiAno1')}
                </th>
                <th onClick={() => handleSort('paybackMeses')} className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Payback {renderSortIcon('paybackMeses')}
                </th>
                <th onClick={() => handleSort('situacao')} className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/70 transition-colors">
                  Status {renderSortIcon('situacao')}
                </th>
                <th className="py-3 px-4 text-center">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-800">
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
                    Nenhum levantamento encontrado. Clique em "Nova Oportunidade" para cadastrar.
                  </td>
                </tr>
              ) : (
                sortedRegistros.map((item) => {
                  const isExpanded = expandedRows.has(item.id);

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => toggleExpandRow(item.id)}
                        className={`cursor-pointer transition-colors duration-150 hover:bg-slate-50 ${
                          isExpanded ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        {/* Chevron */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => toggleExpandRow(item.id, e)}
                            className="p-1.5 rounded text-slate-400 hover:text-[#1351b4] hover:bg-blue-50/50 transition-colors bg-transparent border-0 shadow-none cursor-pointer"
                            aria-label="Expandir detalhes"
                          >
                            <i className={`fas fa-chevron-${isExpanded ? 'down text-[#1351b4]' : 'right text-slate-400'} text-xs`}></i>
                          </button>
                        </td>

                        {/* ID */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-[#1351b4]">{item.idAnalise}</span>
                            {item.idOrigem && item.idOrigem !== '-' && (
                              <span className="text-[10px] text-slate-400 font-mono">({item.idOrigem})</span>
                            )}
                          </div>
                        </td>

                        {/* Processo & Área */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-xs">{item.nomeProcesso}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{item.area}</div>
                        </td>

                        {/* Custo Atual */}
                        <td className="py-3.5 px-3 text-right font-semibold text-red-700 whitespace-nowrap">
                          R$ {item.custoMensalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                        </td>

                        {/* FTE Liberado */}
                        <td className="py-3.5 px-3 text-right font-bold text-green-700 whitespace-nowrap">
                          {item.fteLiberado} FTE
                        </td>

                        {/* Complexidade */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              item.complexidade === 'Baixa'
                                ? 'bg-green-100 text-green-800'
                                : item.complexidade === 'Média'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.complexidade}
                          </span>
                        </td>

                        {/* ROI 1 Ano */}
                        <td className="py-3.5 px-3 text-right font-bold text-green-700 whitespace-nowrap">
                          R$ {item.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Payback */}
                        <td className="py-3.5 px-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                          {item.paybackMeses.toFixed(1)} meses
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded font-medium text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                            {item.situacao}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-slate-600 hover:text-[#1351b4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Editar Levantamento"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.nomeProcesso)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Excluir Levantamento"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Sub-row Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <td colSpan={10} className="p-4 sm:p-6">
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
                                    <span className="font-semibold text-slate-800">{item.periodicidade}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Perfil Executor:</span>
                                    <span className="font-semibold text-slate-800">{item.perfilExecutor}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Tempo Execução:</span>
                                    <span className="font-semibold text-slate-800">{item.tempoExecucao} h / mês</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Custo Atual Mensal:</span>
                                    <span className="font-bold text-red-600">R$ {item.custoMensalAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="pt-1 border-t border-slate-100">
                                    <span className="text-slate-500 block mb-0.5">Sistemas Envolvidos:</span>
                                    <span className="font-medium text-slate-700 text-[10px] bg-slate-50 p-1.5 rounded block border border-slate-200">
                                      {item.sistemasEnvolvidos || 'Não informado'}
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
                                    <span className="font-bold text-[#1351b4]">{item.tipoPlataformaNome || 'Python & Robot Framework'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Complexidade:</span>
                                    <span className="font-semibold text-slate-800">{item.complexidade}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Score de Benefícios:</span>
                                    <span className="font-bold text-[#1351b4]">{(item.pontuacaoBeneficios * 100).toFixed(1)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Redução de Tempo:</span>
                                    <span className="font-semibold text-green-700">{item.reducaoTempoPrevista}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Redução de Custo:</span>
                                    <span className="font-semibold text-green-700">{item.reducaoCustoPrevista}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">FTE Poupado:</span>
                                    <span className="font-bold text-green-700">{item.fteLiberado} FTE</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Turno de Operação:</span>
                                    <span className="font-semibold text-slate-800">{item.turno || 'Diurno'}</span>
                                  </div>
                                  <div className="flex justify-between pt-1 border-t border-slate-100">
                                    <span className="text-slate-500">Recomendação:</span>
                                    <span className="font-semibold text-slate-800">{item.recomendacao}</span>
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
                                    <span className="font-semibold text-slate-800">R$ {item.investimentoSetup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Custo TO BE (Ano 1/mês):</span>
                                    <span className="font-semibold text-slate-800">R$ {item.custoMensalAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Custo TO BE (Ano 2/mês):</span>
                                    <span className="font-semibold text-slate-800">R$ {item.custoMensalAno2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Economia Mensal (Ano 1):</span>
                                    <span className="font-bold text-green-700">R$ {((item.custoMensalAtual || 0) - (item.custoMensalAno1 || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between pt-1 border-t border-slate-100">
                                    <span className="text-slate-500">ROI Líquido (Ano 1):</span>
                                    <span className="font-bold text-green-700">R$ {item.roiAno1.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">ROI Líquido (Ano 2):</span>
                                    <span className="font-bold text-green-800">R$ {item.roiAno2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Payback Estimado:</span>
                                    <span className="font-bold text-amber-700">{item.paybackMeses.toFixed(1)} meses</span>
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

      {/* Modal CRUD */}
      <RegistroFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingRegistro}
        parametro={parametro}
      />
    </div>
  );
};

