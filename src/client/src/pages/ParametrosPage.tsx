import React, { useState, useEffect } from 'react';
import { Parametro, PerfilPlataforma, Area } from '../types';
import { api } from '../services/api';
import { Tooltip } from '../components/Tooltip';
import { Modal } from '../components/Modal';
import { useNotification } from '../components/Notification';

export const ParametrosPage: React.FC = () => {
  const notify = useNotification();
  const [parametro, setParametro] = useState<Parametro | null>(null);
  const [perfis, setPerfis] = useState<PerfilPlataforma[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'beneficios' | 'taxas' | 'perfis' | 'areas'>('beneficios');

  // Modal State para Perfil de Plataforma
  const [perfilModalOpen, setPerfilModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<PerfilPlataforma | null>(null);
  const [perfilFormData, setPerfilFormData] = useState<Partial<PerfilPlataforma>>({
    nome: '',
    categoria: 'Open Source / Scripting',
    descricao: '',
    custoLicencaMensal: 0,
    custoEstacaoTrabalho: 0,
    custoServidor: 1150.7,
    nrRobosDiluicao: 5,
    isPadrao: false,
  });

  // Modal State para Áreas & Diretorias
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [areaFormData, setAreaFormData] = useState<Partial<Area>>({
    nome: '',
    sigla: '',
    responsavel: '',
    descricao: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paramData, perfisData, areasData] = await Promise.all([
        api.getParametros(),
        api.getPerfisPlataforma(),
        api.getAreas(),
      ]);
      setParametro(paramData);
      setPerfis(perfisData);
      setAreas(areasData);
    } catch (err: any) {
      console.error(err);
      notify.error('Erro de Carregamento', 'Não foi possível carregar as configurações globais.');
    } finally {
      setLoading(false);
    }
  };

  const handleParamChange = (field: keyof Parametro, value: number) => {
    if (!parametro) return;
    setParametro({ ...parametro, [field]: value });
  };

  const handleSaveParametros = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parametro) return;
    try {
      setSaving(true);
      const updated = await api.updateParametros(parametro);
      setParametro(updated);
      setSaveSuccess(true);
      notify.success('Sucesso', 'Parâmetros globais de custeio e benefícios salvos com sucesso.');
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      notify.error('Erro ao Salvar', err.message || 'Erro ao salvar parâmetros.');
    } finally {
      setSaving(false);
    }
  };

  // CRUD Perfil de Plataforma
  const handleOpenNewPerfil = () => {
    setEditingPerfil(null);
    setPerfilFormData({
      nome: '',
      categoria: 'Open Source / Scripting',
      descricao: '',
      custoLicencaMensal: 0,
      custoEstacaoTrabalho: 0,
      custoServidor: 1150.7,
      nrRobosDiluicao: 5,
      isPadrao: false,
    });
    setPerfilModalOpen(true);
  };

  const handleOpenEditPerfil = (p: PerfilPlataforma) => {
    setEditingPerfil(p);
    setPerfilFormData({ ...p });
    setPerfilModalOpen(true);
  };

  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPerfil) {
        await api.updatePerfilPlataforma(editingPerfil.id, perfilFormData);
        notify.success('Perfil Atualizado', `Perfil "${perfilFormData.nome}" atualizado.`);
      } else {
        await api.createPerfilPlataforma(perfilFormData);
        notify.success('Perfil Criado', `Novo perfil "${perfilFormData.nome}" cadastrado.`);
      }
      setPerfilModalOpen(false);
      const updatedPerfis = await api.getPerfisPlataforma();
      setPerfis(updatedPerfis);
    } catch (err: any) {
      notify.error('Erro no Perfil', err.message || 'Erro ao salvar perfil de plataforma.');
    }
  };

  const handleDeletePerfil = async (id: string, nome: string) => {
    if (confirm(`Deseja realmente excluir o perfil "${nome}"?`)) {
      try {
        await api.deletePerfilPlataforma(id);
        const updatedPerfis = await api.getPerfisPlataforma();
        setPerfis(updatedPerfis);
        notify.success('Perfil Removido', `O perfil "${nome}" foi excluído com sucesso.`);
      } catch (err: any) {
        notify.error('Erro ao Excluir', err.message || 'Erro ao excluir perfil.');
      }
    }
  };

  const handleSetPadraoPerfil = async (p: PerfilPlataforma) => {
    try {
      await api.updatePerfilPlataforma(p.id, { isPadrao: true });
      const updatedPerfis = await api.getPerfisPlataforma();
      setPerfis(updatedPerfis);
      notify.success('Perfil Padrão', `O perfil "${p.nome}" agora é a plataforma padrão.`);
    } catch (err: any) {
      notify.error('Erro ao Definir Padrão', err.message || 'Erro ao definir perfil padrão.');
    }
  };

  // CRUD Áreas & Diretorias
  const handleOpenNewArea = () => {
    setEditingArea(null);
    setAreaFormData({
      nome: '',
      sigla: '',
      responsavel: '',
      descricao: '',
    });
    setAreaModalOpen(true);
  };

  const handleOpenEditArea = (a: Area) => {
    setEditingArea(a);
    setAreaFormData({ ...a });
    setAreaModalOpen(true);
  };

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaFormData.nome || !areaFormData.nome.trim()) {
      notify.error('Campo Obrigatório', 'O nome da área corporativa é obrigatório.');
      return;
    }
    try {
      if (editingArea) {
        await api.updateArea(editingArea.id, areaFormData);
        notify.success('Área Atualizada', `Área "${areaFormData.nome}" atualizada com sucesso.`);
      } else {
        await api.createArea(areaFormData);
        notify.success('Área Cadastrada', `Área "${areaFormData.nome}" cadastrada com sucesso.`);
      }
      setAreaModalOpen(false);
      const updatedAreas = await api.getAreas();
      setAreas(updatedAreas);
    } catch (err: any) {
      notify.error('Erro na Área', err.message || 'Erro ao salvar área corporativa.');
    }
  };

  const handleDeleteArea = async (id: string, nome: string) => {
    if (confirm(`Deseja realmente excluir a área "${nome}"?`)) {
      try {
        await api.deleteArea(id);
        const updatedAreas = await api.getAreas();
        setAreas(updatedAreas);
        notify.success('Área Removida', `A área "${nome}" foi excluída com sucesso.`);
      } catch (err: any) {
        notify.error('Erro ao Excluir', err.message || 'Erro ao excluir área corporativa.');
      }
    }
  };

  if (loading || !parametro) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1351b4]"></div>
      </div>
    );
  }

  // Cálculos dinâmicos dos parâmetros (12 Critérios Corporativos)
  const somaPesos =
    (parametro.pesoLiberarPessoas || 3) +
    (parametro.pesoReduzirCusto || 3) +
    (parametro.pesoReduzirErros || 3) +
    (parametro.pesoSegurancaPrivacidade || 3) +
    (parametro.pesoRastreabilidadeCompliance || 3) +
    (parametro.pesoKeyPersonRisk || 2) +
    (parametro.pesoMelhorarExpCliente || 2) +
    (parametro.pesoAumentarCapacidade || 2) +
    (parametro.pesoReduzirTempoResposta || 2) +
    (parametro.pesoInteroperabilidade || 2) +
    (parametro.pesoTransformacaoDigital || 1) +
    (parametro.pesoSustentabilidadeEsg || 1);

  return (
    <div className="space-y-6">
      {/* Header com Identidade GOVBR DS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[var(--govbr-blue-warm-vivid-90)] tracking-tight">
            Parâmetros Globais & Governança Corporativa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configuração central de pesos estratégicos, taxas financeiras (VPL/Setup), plataformas tecnológicas e catálogo de áreas.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-800 border border-green-200 rounded-md text-xs font-semibold animate-fade-in">
            <i className="fas fa-check-circle text-green-600 text-xs"></i>
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('beneficios')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'beneficios'
                ? 'border-[#1351b4] text-[#1351b4] bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <i className="fas fa-balance-scale mr-2 text-xs"></i>
            1. Matriz de 12 Critérios Corporativos
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('taxas')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'taxas'
                ? 'border-[#1351b4] text-[#1351b4] bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <i className="fas fa-calculator mr-2 text-xs"></i>
            2. Taxas Operacionais, VPL & Turnos
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('perfis')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'perfis'
                ? 'border-[#1351b4] text-[#1351b4] bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <i className="fas fa-server mr-2 text-xs"></i>
            3. Plataformas Tecnológicas & Licenciamento ({perfis.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('areas')}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'areas'
                ? 'border-[#1351b4] text-[#1351b4] bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <i className="fas fa-building mr-2 text-xs"></i>
            4. Áreas & Diretorias Corporativas ({areas.length})
          </button>
        </div>

        {/* Tab 1: Matriz de Benefícios */}
        {activeTab === 'beneficios' && (
          <form onSubmit={handleSaveParametros} className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Pesos da Matriz de Decisão Estratégica</h3>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  Os 12 critérios universais compõem a nota final de benefícios corporativos (Soma Total de Pesos: {somaPesos} pts).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Liberar Capacidade */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Liberar Capacidade / Realocação
                    <Tooltip content="Foco na liberação de tempo das equipes para atividades analíticas de inteligência." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoLiberarPessoas || 3}
                  onChange={(e) => handleParamChange('pesoLiberarPessoas', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 2. Reduzir Custos */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Redução de Custos Operacionais
                    <Tooltip content="Economia orçamentária direta decorrente da substituição de rotinas repetitivas." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirCusto || 3}
                  onChange={(e) => handleParamChange('pesoReduzirCusto', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 3. Reduzir Erros */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Redução de Erros Operacionais
                    <Tooltip content="Eliminação de falhas humanas na digitação, validação de regras fiscais e transações." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirErros || 3}
                  onChange={(e) => handleParamChange('pesoReduzirErros', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 4. Segurança e Privacidade */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Segurança & Privacidade (LGPD)
                    <Tooltip content="Proteção contra vazamento de dados, sigilo bancário/fiscal e conformidade com a LGPD." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoSegurancaPrivacidade || 3}
                  onChange={(e) => handleParamChange('pesoSegurancaPrivacidade', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 5. Rastreabilidade e Compliance */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Rastreabilidade & Compliance
                    <Tooltip content="Trilha de auditoria digital completa, logs imutáveis e facilidade para fiscalização de órgãos de controle." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoRastreabilidadeCompliance || 3}
                  onChange={(e) => handleParamChange('pesoRastreabilidadeCompliance', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 6. Key Person Risk */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Mitigação de Key-Person Risk
                    <Tooltip content="Redução da dependência de pessoas-chave ou especialistas detentores de conhecimento tácito." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoKeyPersonRisk || 2}
                  onChange={(e) => handleParamChange('pesoKeyPersonRisk', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 7. Melhorar Experiência */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Experiência do Cliente / Cidadão
                    <Tooltip content="Aumento da satisfação percebida, respostas instantâneas e facilidade de autosserviço." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoMelhorarExpCliente || 2}
                  onChange={(e) => handleParamChange('pesoMelhorarExpCliente', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 8. Aumentar Capacidade */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Capacidade & Escalabilidade
                    <Tooltip content="Absorção de grandes aumentos de volume e picos sazonais sem necessidade de contratação." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoAumentarCapacidade || 2}
                  onChange={(e) => handleParamChange('pesoAumentarCapacidade', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 9. Reduzir Tempo Resposta */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Redução do Tempo de Resposta (SLA)
                    <Tooltip content="Diminuição drástica do lead time entre a solicitação inicial e a entrega do serviço." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirTempoResposta || 2}
                  onChange={(e) => handleParamChange('pesoReduzirTempoResposta', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 10. Interoperabilidade */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Interoperabilidade de Sistemas
                    <Tooltip content="Integração ágil e não-invasiva entre múltiplos softwares legados, APIs e bancos de dados." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoInteroperabilidade || 2}
                  onChange={(e) => handleParamChange('pesoInteroperabilidade', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 11. Transformação Digital */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Transformação Digital & Inovação
                    <Tooltip content="Modernização de rotinas, fomento à cultura de dados e automação no setor público." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoTransformacaoDigital || 1}
                  onChange={(e) => handleParamChange('pesoTransformacaoDigital', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 12. Sustentabilidade ESG */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Sustentabilidade Operacional (ESG)
                    <Tooltip content="Desmaterialização de documentos físicos, redução drástica do consumo de papel e governança sustentável." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoSustentabilidadeEsg || 1}
                  onChange={(e) => handleParamChange('pesoSustentabilidadeEsg', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1351b4] hover:bg-[#0c326f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <i className="fas fa-save text-xs"></i>
                <span>{saving ? 'Salvando...' : 'Salvar Pesos da Matriz'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Taxas Operacionais, VPL & Turnos */}
        {activeTab === 'taxas' && (
          <form onSubmit={handleSaveParametros} className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Taxas Operacionais, VPL & Turnos de Execução</h3>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  Configure a carga horária de referência, custos operacionais de NOC, valor hora de desenvolvimento e parâmetros de VPL (FCAIA).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Carga Horária Padrão */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Carga Horária Padrão (HH/Mês)
                  <Tooltip content="Jornada média mensal de referência para dimensionamento de FTE liberado (Padrão 160h = 40h semanais)." />
                </label>
                <input
                  type="number"
                  value={parametro.cargaHorariaPadrao}
                  onChange={(e) => handleParamChange('cargaHorariaPadrao', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* Posto Sustentação NOC */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Posto Sustentação NOC / Operador (R$/Mês)
                  <Tooltip content="Custo mensal total do posto de monitoramento 24x7 e sustentação operacional de robôs, incluindo encargos e adicionais." />
                </label>
                <input
                  type="number"
                  step="50"
                  value={parametro.operadorSalaControle}
                  onChange={(e) => handleParamChange('operadorSalaControle', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none font-semibold text-slate-900"
                />
              </div>

              {/* Custo Hora Dev */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Custo Hora de Engenharia/Dev (R$/HH)
                  <Tooltip content="Valor integral da hora técnica de analistas/desenvolvedores para desenvolvimento e setup das soluções de automação." />
                </label>
                <input
                  type="number"
                  step="5"
                  value={parametro.custoHoraDesenvolvimento}
                  onChange={(e) => handleParamChange('custoHoraDesenvolvimento', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none font-semibold text-slate-900"
                />
              </div>

              {/* Taxa Desconto VPL */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Taxa de Desconto Institucional VPL (% a.a.)
                  <Tooltip content="Taxa anual de desconto financeiro utilizada no cálculo do Valor Presente Líquido em 3 anos (Padrão 12% a.a. Serpro)." />
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={parametro.taxaDescontoVpl !== undefined ? parametro.taxaDescontoVpl : 0.12}
                  onChange={(e) => handleParamChange('taxaDescontoVpl', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none font-semibold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Equivalente a {((parametro.taxaDescontoVpl !== undefined ? parametro.taxaDescontoVpl : 0.12) * 100).toFixed(1)}% ao ano.
                </span>
              </div>

              {/* Horizonte VPL Meses */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Horizonte Padrão de Análise VPL (Meses)
                  <Tooltip content="Período de amortização e projeção do fluxo de caixa líquido para avaliação do portfólio (Padrão 36 meses = 3 anos)." />
                </label>
                <input
                  type="number"
                  step="1"
                  min="12"
                  max="60"
                  value={parametro.horizonteVplMeses !== undefined ? parametro.horizonteVplMeses : 36}
                  onChange={(e) => handleParamChange('horizonteVplMeses', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none font-semibold text-slate-900"
                />
              </div>

              {/* Percentual Diurno */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Percentual Turno Diurno (08h às 18h)
                  <Tooltip content="Fração do rateio de custos alocada ao turno comercial diurno (21 dias x 10h = 210h disponíveis)." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={parametro.percDiurno}
                  onChange={(e) => handleParamChange('percDiurno', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* Percentual Noturno */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Percentual Turno Noturno (18h às 08h)
                  <Tooltip content="Fração do rateio de custos alocada ao turno noturno em lote (21 dias x 14h = 294h disponíveis)." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={parametro.percNoturno}
                  onChange={(e) => handleParamChange('percNoturno', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* Percentual Fim de Semana */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Percentual Final de Semana (Sáb/Dom)
                  <Tooltip content="Fração do rateio alocada a rotinas massivas de finais de semana (8 dias x 24h = 192h disponíveis)." />
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={parametro.percFimDeSemana}
                  onChange={(e) => handleParamChange('percFimDeSemana', Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1351b4] hover:bg-[#0c326f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <i className="fas fa-save text-xs"></i>
                <span>{saving ? 'Salvando...' : 'Salvar Taxas Operacionais & VPL'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Perfis de Plataforma Tecnológica */}
        {activeTab === 'perfis' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Plataformas Tecnológicas de Execução</h3>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  Gerencie as opções de orquestração (Python, n8n, Power Automate, OutSystems) e seus custos mensais de licenciamento.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewPerfil}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <i className="fas fa-plus text-xs"></i>
                <span>Nova Plataforma</span>
              </button>
            </div>

            {/* Grid de Perfis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {perfis.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-lg border transition-all ${
                    p.isPadrao
                      ? 'border-[#1351b4] bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{p.nome}</span>
                        {p.isPadrao && (
                          <span className="text-[10px] font-bold text-[#1351b4] bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                            Padrão Corporativo
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
                        {p.categoria}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {!p.isPadrao && (
                        <button
                          type="button"
                          onClick={() => handleSetPadraoPerfil(p)}
                          className="p-1.5 text-slate-500 hover:text-[#1351b4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Definir como Plataforma Padrão"
                        >
                          <i className="far fa-star text-xs"></i>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditPerfil(p)}
                        className="p-1.5 text-slate-500 hover:text-[#1351b4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="Editar Plataforma"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePerfil(p.id, p.nome)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Excluir Plataforma"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 my-3 leading-relaxed">{p.descricao}</p>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-[10px] text-slate-500 block">Licença / Mês</span>
                      <span className="font-bold text-slate-800">
                        {p.custoLicencaMensal > 0
                          ? `R$ ${p.custoLicencaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : 'R$ 0,00 (Open Source)'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-[10px] text-slate-500 block">Estação / Mês</span>
                      <span className="font-bold text-slate-800">
                        R$ {p.custoEstacaoTrabalho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-[10px] text-slate-500 block">Rateio Robôs</span>
                      <span className="font-bold text-slate-800">{p.nrRobosDiluicao} robôs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Áreas & Diretorias Corporativas */}
        {activeTab === 'areas' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Catálogo de Áreas & Diretorias Corporativas</h3>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  Cadastre as áreas solicitantes para padronizar os formulários de entrada (N0 a N3) e filtros do portfólio.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewArea}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="fas fa-plus text-xs"></i>
                <span>Nova Área / Diretoria</span>
              </button>
            </div>

            {/* Tabela de Áreas */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Sigla</th>
                    <th className="py-2.5 px-3">Nome da Área / Diretoria</th>
                    <th className="py-2.5 px-3">Responsável / Ponto Focal</th>
                    <th className="py-2.5 px-3">Descrição & Escopo</th>
                    <th className="py-2.5 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs bg-white">
                  {areas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        Nenhuma área cadastrada. Clique em "Nova Área / Diretoria" para iniciar.
                      </td>
                    </tr>
                  ) : (
                    areas.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-bold text-[#1351b4] whitespace-nowrap">
                          {a.sigla || '-'}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {a.nome}
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                          {a.responsavel || '-'}
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-[11px]">
                          {a.descricao || '-'}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditArea(a)}
                              className="p-1.5 text-slate-600 hover:text-[#1351b4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="Editar Área"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteArea(a.id, a.nome)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              title="Excluir Área"
                            >
                              <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal CRUD Perfil de Plataforma */}
      <Modal
        isOpen={perfilModalOpen}
        onClose={() => setPerfilModalOpen(false)}
        title={editingPerfil ? 'Editar Plataforma Tecnológica' : 'Nova Plataforma Tecnológica'}
        maxWidth="lg"
      >
        <form onSubmit={handleSavePerfil} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Nome da Plataforma *
            </label>
            <input
              type="text"
              required
              value={perfilFormData.nome || ''}
              onChange={(e) => setPerfilFormData({ ...perfilFormData, nome: e.target.value })}
              placeholder="Ex: Python & Robot Framework (Cloud Native)"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Categoria Arquitetural
            </label>
            <select
              value={perfilFormData.categoria || 'Open Source / Scripting'}
              onChange={(e) => setPerfilFormData({ ...perfilFormData, categoria: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none bg-white cursor-pointer"
            >
              <option value="Open Source / Scripting">Open Source / Scripting (Python, Robot)</option>
              <option value="Workflow & iPaaS">Workflow & iPaaS (n8n, Camunda, Airflow)</option>
              <option value="RPA Proprietário">RPA Proprietário (Power Automate, UiPath)</option>
              <option value="Low-Code / RAD">Low-Code / RAD (OutSystems, Appian)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Descrição & Casos de Uso
            </label>
            <textarea
              rows={3}
              value={perfilFormData.descricao || ''}
              onChange={(e) => setPerfilFormData({ ...perfilFormData, descricao: e.target.value })}
              placeholder="Descreva quando esta plataforma deve ser recomendada..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Custo de Licença (R$/Mês)
              </label>
              <input
                type="number"
                step="10"
                value={perfilFormData.custoLicencaMensal}
                onChange={(e) => setPerfilFormData({ ...perfilFormData, custoLicencaMensal: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Estação de Trabalho (R$/Mês)
              </label>
              <input
                type="number"
                step="10"
                value={perfilFormData.custoEstacaoTrabalho}
                onChange={(e) => setPerfilFormData({ ...perfilFormData, custoEstacaoTrabalho: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Custo Servidor / Cluster (R$/Mês)
              </label>
              <input
                type="number"
                step="50"
                value={perfilFormData.custoServidor}
                onChange={(e) => setPerfilFormData({ ...perfilFormData, custoServidor: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Quantidade de Robôs p/ Diluição
              </label>
              <input
                type="number"
                min="1"
                value={perfilFormData.nrRobosDiluicao}
                onChange={(e) => setPerfilFormData({ ...perfilFormData, nrRobosDiluicao: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isPadrao"
              checked={perfilFormData.isPadrao || false}
              onChange={(e) => setPerfilFormData({ ...perfilFormData, isPadrao: e.target.checked })}
              className="rounded text-[#1351b4] focus:ring-[#1351b4] cursor-pointer"
            />
            <label htmlFor="isPadrao" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Definir como plataforma tecnológica padrão para novos levantamentos
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setPerfilModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white text-xs font-semibold rounded shadow-xs cursor-pointer"
            >
              {editingPerfil ? 'Salvar Alterações' : 'Cadastrar Plataforma'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal CRUD Área & Diretoria */}
      <Modal
        isOpen={areaModalOpen}
        onClose={() => setAreaModalOpen(false)}
        title={editingArea ? 'Editar Área / Diretoria Corporativa' : 'Nova Área / Diretoria Corporativa'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveArea} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Nome da Área / Diretoria *
            </label>
            <input
              type="text"
              required
              value={areaFormData.nome || ''}
              onChange={(e) => setAreaFormData({ ...areaFormData, nome: e.target.value })}
              placeholder="Ex: Faturamento / Arrecadação"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Sigla / Código
              </label>
              <input
                type="text"
                value={areaFormData.sigla || ''}
                onChange={(e) => setAreaFormData({ ...areaFormData, sigla: e.target.value })}
                placeholder="Ex: DIFAT, SUPFC, AUDIT"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Responsável / Ponto Focal
              </label>
              <input
                type="text"
                value={areaFormData.responsavel || ''}
                onChange={(e) => setAreaFormData({ ...areaFormData, responsavel: e.target.value })}
                placeholder="Ex: Coordenação de Faturamento"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Descrição & Escopo de Atuação
            </label>
            <textarea
              rows={3}
              value={areaFormData.descricao || ''}
              onChange={(e) => setAreaFormData({ ...areaFormData, descricao: e.target.value })}
              placeholder="Descreva as principais atribuições e processos sob responsabilidade desta área..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setAreaModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white text-xs font-semibold rounded shadow-xs cursor-pointer"
            >
              {editingArea ? 'Salvar Alterações' : 'Cadastrar Área'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
