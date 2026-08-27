import React, { useState, useEffect } from 'react';
import { Parametro, PerfilPlataforma } from '../types';
import { api } from '../services/api';
import { Tooltip } from '../components/Tooltip';
import { useNotification } from '../components/Notification';

export const ParametrosPage: React.FC = () => {
  const notify = useNotification();
  const [parametro, setParametro] = useState<Parametro | null>(null);
  const [perfis, setPerfis] = useState<PerfilPlataforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'beneficios' | 'taxas' | 'perfis'>('beneficios');

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paramData, perfisData] = await Promise.all([
        api.getParametros(),
        api.getPerfisPlataforma(),
      ]);
      setParametro(paramData);
      setPerfis(perfisData);
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

  const custoHoraManutencao = (parametro.operadorSalaControle * 1.6) / 168;
  const custoSetup1SemanaMensal = (parametro.custoHoraDesenvolvimento * 40) / 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="br-card bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight m-0">Parametrização e Configurações Globais</h2>
          <p className="text-xs text-slate-600 mt-1 m-0">
            Governança de pesos da matriz corporativa, taxas operacionais globais e catálogo de plataformas tecnológicas.
          </p>
        </div>

        {activeTab !== 'perfis' && (
          <button
            type="button"
            onClick={handleSaveParametros}
            disabled={saving}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#1351b4] hover:bg-[#0c326f] active:bg-[#072549] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <i className="fas fa-save text-xs"></i>
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="flex items-center space-x-3 bg-green-50 border border-green-200 p-4 rounded-md text-green-900 text-xs shadow-xs" role="alert">
          <i className="fas fa-check-circle text-green-600 text-base flex-shrink-0"></i>
          <div>
            <span className="font-bold">Parâmetros globais atualizados com sucesso!</span>
            <p className="text-[11px] text-green-700 mt-0.5 m-0">
              Os novos índices e fórmulas foram salvos e aplicados aos cálculos e levantamentos.
            </p>
          </div>
        </div>
      )}

      {/* Main Container with Tabs */}
      <div className="br-card bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2 overflow-x-auto">
          {[
            { id: 'beneficios', label: '1. Matriz de Benefícios (Pesos)', iconFa: 'fas fa-award' },
            { id: 'taxas', label: '2. Taxas Operacionais & Turnos', iconFa: 'fas fa-clock' },
            { id: 'perfis', label: '3. Catálogo de Plataformas Tecnológicas', iconFa: 'fas fa-layer-group' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#1351b4] text-[#1351b4] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <i className={`${tab.iconFa} ${isActive ? 'text-[#1351b4]' : 'text-slate-400'}`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Matriz de Benefícios */}
        {activeTab === 'beneficios' && (
          <form onSubmit={handleSaveParametros} className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Matriz de Priorização Estratégica Corporativa</h3>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  12 critérios universais calibrados para avaliação qualitativa, governança e conformidade empresarial.
                </p>
              </div>

              <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-md bg-[var(--govbr-blue-warm-vivid-70)] text-white font-bold text-xs shadow-xs whitespace-nowrap">
                Soma de Pesos: {somaPesos} pontos
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Liberar Capacidade */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Liberar Capacidade / Pessoas
                    <Tooltip content="Redirecionamento de esforço humano de tarefas repetitivas para análises estratégicas e atividades de alto valor." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoLiberarPessoas}
                  onChange={(e) => handleParamChange('pesoLiberarPessoas', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 2. Reduzir Custo */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Reduzir Custos Operacionais
                    <Tooltip content="Impacto na eficiência orçamentária e redução de despesas operacionais diretas com processos manuais." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirCusto}
                  onChange={(e) => handleParamChange('pesoReduzirCusto', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 3. Redução de Erros */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Redução de Erros Operacionais
                    <Tooltip content="Eliminação de falhas humanas na digitação, validação de regras de negócio, inconsistências e retrabalho." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirErros}
                  onChange={(e) => handleParamChange('pesoReduzirErros', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 4. Segurança & Privacidade */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Segurança & Privacidade (LGPD)
                    <Tooltip content="Proteção contra vazamento de dados confidenciais, execução segura em cofre de credenciais e compliance LGPD/GDPR." />
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

              {/* 5. Rastreabilidade & Compliance */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Rastreabilidade & Compliance
                    <Tooltip content="Trilha de auditoria digital completa, carimbos de tempo, evidências imutáveis e conformidade corporativa e regulatória." />
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

              {/* 6. Key-Person Risk */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Mitigação de Key-Person Risk
                    <Tooltip content="Eliminação de gargalos e riscos operacionais decorrentes de conhecimento tácito concentrado em poucas pessoas-chave." />
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

              {/* 7. Experiência do Cliente / Usuário */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Experiência do Cliente / Usuário
                    <Tooltip content="Melhoria na percepção de qualidade, padronização e agilidade percebida pelo cliente ou usuário final." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoMelhorarExpCliente}
                  onChange={(e) => handleParamChange('pesoMelhorarExpCliente', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 8. Aumentar Capacidade */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Capacidade & Escalabilidade
                    <Tooltip content="Capacidade de absorver aumentos bruscos de volume e picos sazonais de demanda sem novos gargalos." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoAumentarCapacidade}
                  onChange={(e) => handleParamChange('pesoAumentarCapacidade', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 9. Reduzir SLA */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Reduzir Tempo de Resposta (SLA)
                    <Tooltip content="Diminuição drástica do tempo de ciclo entre a entrada do pedido e a conclusão final do processo." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoReduzirTempoResposta}
                  onChange={(e) => handleParamChange('pesoReduzirTempoResposta', Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              {/* 10. Interoperabilidade entre Sistemas */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Interoperabilidade entre Sistemas
                    <Tooltip content="Integração ágil e não invasiva entre múltiplos softwares, ERPs, bancos legados, planilhas e portais web." />
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

              {/* 11. Transformação Digital & Inovação */}
              <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center">
                    Transformação Digital & Inovação
                    <Tooltip content="Modernização tecnológica contínua, fomento à cultura de automação e eliminação de rotinas analógicas." />
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Peso 1 a 3</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={parametro.pesoTransformacaoDigital}
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

        {/* Tab 2: Taxas Operacionais & Turnos */}
        {activeTab === 'taxas' && (
          <form onSubmit={handleSaveParametros} className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Taxas Operacionais & Turnos de Execução</h3>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  Configure a carga horária de referência, custos operacionais de NOC, valor hora de desenvolvimento e percentuais de turno.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Percentual Turno Noturno (18h às 08h)
                  <Tooltip content="Fração do rateio de custos alocada à janela noturna de processamento em lote (21 dias x 14h = 294h disponíveis)." />
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

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Percentual Turno Fim de Semana
                  <Tooltip content="Fração do rateio de custos para execuções contínuas de sábado e domingo (8 dias x 24h = 192h disponíveis)." />
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

            {/* Derived Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Custo Hora de Manutenção do Robô</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  R$ {custoHoraManutencao.toFixed(2)} / hora
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Fórmula: Operador NOC x 1.6 / 168h</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200 stat-box-emerald">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block stat-title">Custo Setup por Semana de Esforço</span>
                <div className="text-xl font-bold text-emerald-950 mt-0.5 stat-value">
                  R$ {custoSetup1SemanaMensal.toFixed(2)} / mês (12 meses)
                </div>
                <span className="text-[11px] text-emerald-700 mt-1 block stat-desc">Fórmula: Hora Dev x 40h / 12 meses</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1351b4] hover:bg-[#0c326f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <i className="fas fa-save text-xs"></i>
                <span>{saving ? 'Salvando...' : 'Salvar Taxas Operacionais'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Catálogo de Plataformas Tecnológicas */}
        {activeTab === 'perfis' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 m-0">Perfis de Plataformas Tecnológicas</h3>
                <p className="text-xs text-slate-600 mt-0.5 m-0">
                  Gerencie custos de licença, estações e diluição em servidor para cada tecnologia adotada no Centro de Excelência.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewPerfil}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <i className="fas fa-plus text-xs"></i>
                <span>Nova Plataforma</span>
              </button>
            </div>

            {/* Grid de Perfis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {perfis.map((p) => {
                const baseCusto =
                  (p.custoServidor / (p.nrRobosDiluicao || 1)) +
                  p.custoLicencaMensal +
                  p.custoEstacaoTrabalho +
                  (parametro.operadorSalaControle / (p.nrRobosDiluicao || 1));

                const taxaDiurno = (baseCusto * parametro.percDiurno) / 21 / 10;

                return (
                  <div
                    key={p.id}
                    className={`br-card p-5 rounded-lg border transition-all ${
                      p.isPadrao
                        ? 'bg-blue-50/40 border-[#1351b4] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm m-0">{p.nome}</h4>
                          {p.isPadrao && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                              <i className="fas fa-star text-[9px] text-blue-700 mr-1"></i>
                              <span>Padrão</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{p.categoria}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {!p.isPadrao && (
                          <button
                            type="button"
                            title="Definir como padrão"
                            onClick={() => handleSetPadraoPerfil(p)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                          >
                            <i className="fas fa-star text-xs"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          title="Editar custos"
                          onClick={() => handleOpenEditPerfil(p)}
                          className="p-1.5 text-slate-400 hover:text-[#1351b4] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          type="button"
                          title="Excluir plataforma"
                          onClick={() => handleDeletePerfil(p.id, p.nome)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed m-0">{p.descricao || 'Sem descrição informada.'}</p>

                    {/* Breakdown de Custos */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Licença / Robô</span>
                        <span className="font-bold text-slate-800">
                          {p.custoLicencaMensal > 0 ? `R$ ${p.custoLicencaMensal.toFixed(2)}` : 'R$ 0,00 (Livre)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Estação Dedicada</span>
                        <span className="font-bold text-slate-800">
                          {p.custoEstacaoTrabalho > 0 ? `R$ ${p.custoEstacaoTrabalho.toFixed(2)}` : 'R$ 0,00 (N/A)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Servidor / Rateio</span>
                        <span className="font-bold text-slate-800">{p.nrRobosDiluicao} robôs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#1351b4] block font-bold">Taxa Diurna</span>
                        <span className="font-bold text-[#1351b4]">R$ {taxaDiurno.toFixed(2)}/h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Criar / Editar Perfil de Plataforma (br-modal estilo) */}
      {perfilModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2 m-0">
                <i className="fas fa-layer-group text-[#1351b4] mr-2"></i>
                <span>{editingPerfil ? 'Editar Plataforma Tecnológica' : 'Nova Plataforma Tecnológica'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setPerfilModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Fechar"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleSavePerfil} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome da Plataforma
                  <Tooltip content="Nome de exibição da ferramenta (ex: Python & Robot Framework, n8n, Power Automate)." />
                </label>
                <input
                  type="text"
                  required
                  value={perfilFormData.nome || ''}
                  onChange={(e) => setPerfilFormData({ ...perfilFormData, nome: e.target.value })}
                  placeholder="Ex: n8n Workflow Automation"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Categoria
                    <Tooltip content="Classificação arquitetural da plataforma de automação." />
                  </label>
                  <select
                    value={perfilFormData.categoria || 'Open Source / Scripting'}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, categoria: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none cursor-pointer"
                  >
                    <option value="Open Source / Scripting">Open Source / Scripting</option>
                    <option value="Workflow & iPaaS">Workflow & iPaaS</option>
                    <option value="RPA Proprietário">RPA Proprietário</option>
                    <option value="Low-Code / RAD">Low-Code / RAD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nº Robôs para Rateio
                    <Tooltip content="Quantidade de robôs/instâncias no CoE que dividem os custos de servidor e NOC." />
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={perfilFormData.nrRobosDiluicao ?? 5}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, nrRobosDiluicao: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Licença (R$/mês)
                    <Tooltip content="Custo de licença de runtime/execução por robô (R$ 0,00 para Open Source)." />
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={perfilFormData.custoLicencaMensal ?? 0}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, custoLicencaMensal: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estação (R$/mês)
                    <Tooltip content="Custo de máquina virtual desktop dedicada (se exigido pela tecnologia)." />
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={perfilFormData.custoEstacaoTrabalho ?? 0}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, custoEstacaoTrabalho: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Servidor (R$/mês)
                    <Tooltip content="Custo do cluster/servidor de orquestração compartilhado." />
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={perfilFormData.custoServidor ?? 1150.7}
                    onChange={(e) => setPerfilFormData({ ...perfilFormData, custoServidor: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição & Diretriz de Uso
                  <Tooltip content="Breve recomendação técnica de quando utilizar essa plataforma." />
                </label>
                <textarea
                  rows={2}
                  value={perfilFormData.descricao || ''}
                  onChange={(e) => setPerfilFormData({ ...perfilFormData, descricao: e.target.value })}
                  placeholder="Descreva as aplicações ideais desta plataforma..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:border-[#1351b4] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="chkPadrao"
                  checked={!!perfilFormData.isPadrao}
                  onChange={(e) => setPerfilFormData({ ...perfilFormData, isPadrao: e.target.checked })}
                  className="rounded text-[#1351b4] focus:ring-[#1351b4] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="chkPadrao" className="font-semibold text-slate-700 cursor-pointer">
                  Definir como plataforma padrão inicial em novos projetos
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPerfilModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 font-semibold rounded transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1351b4] hover:bg-[#0c326f] text-white font-semibold rounded shadow-xs transition-colors cursor-pointer"
                >
                  Salvar Plataforma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

