export interface InstrumentacaoPendencia {
  campo: string;
  label: string;
  arquetipo?: string;
  ondeEncontrar: string;
  impactoParaPromocao: string;
}

export interface DiagnosticoResultado {
  nivelAtual: 'N0' | 'N1' | 'N2' | 'N3';
  proximoNivel: string;
  percentualPreenchimento: number;
  pendencias: InstrumentacaoPendencia[];
  recomendacoes: string[];
}

export class InstrumentacaoService {
  /**
   * Avalia um registro e gera o diagnóstico de instrumentação detalhado.
   */
  static gerarDiagnostico(registro: any): DiagnosticoResultado {
    const pendencias: InstrumentacaoPendencia[] = [];
    const recomendacoes: string[] = [];

    const nivelAtual = registro.nivelMaturidade || 'N0';
    let camposPreenchidos = 0;
    const totalCamposChave = 10;

    // 1. Identificação Geral
    if (registro.nomeProcesso) camposPreenchidos++;
    if (registro.area) camposPreenchidos++;
    if (registro.descricaoProcesso || registro.sintomasDor) camposPreenchidos++;

    // 2. Variáveis de AS IS (N1)
    if (Number(registro.tempoExecucao) > 0) {
      camposPreenchidos++;
    } else {
      pendencias.push({
        campo: 'tempoExecucao',
        label: 'Tempo Médio de Execução Manual (HH/mês)',
        arquetipo: 'A1',
        ondeEncontrar: 'Entrevista com equipe operacional, planilhas de controle de ponto/tarefa ou histórico de chamados no Jira/ServiceNow.',
        impactoParaPromocao: 'Necessário para calcular FTE liberado e promover de N0 para N1.',
      });
    }

    if (Number(registro.numExecucoes) > 0) {
      camposPreenchidos++;
    } else {
      pendencias.push({
        campo: 'numExecucoes',
        label: 'Volume Mensal de Transações',
        arquetipo: 'Geral / A2',
        ondeEncontrar: 'Logs de sistemas transacionais, ERP (SAP), banco de dados da aplicação ou relatórios mensais.',
        impactoParaPromocao: 'Base para dimensionar capacidade e volumetria do processo.',
      });
    }

    if (Number(registro.valorHoraExecutor) > 0) {
      camposPreenchidos++;
    } else {
      pendencias.push({
        campo: 'valorHoraExecutor',
        label: 'Custo Hora do Perfil Executor (R$/h)',
        arquetipo: 'A1',
        ondeEncontrar: 'Tabela salarial média da área de Gestão de Pessoas (RH) / Biblioteca de Parâmetros Institucionais.',
        impactoParaPromocao: 'Essencial para monetizar as horas humanas em valor financeiro.',
      });
    }

    // 3. Variáveis de Arquétipos Específicos (N2)
    const arq = (registro.arquetipoPrimario || 'A1').toUpperCase();

    if (arq === 'A2') {
      if (!registro.taxaErroAtual || Number(registro.taxaErroAtual) <= 0) {
        pendencias.push({
          campo: 'taxaErroAtual',
          label: 'Taxa de Erro / Retrabalho Atual (%)',
          arquetipo: 'A2',
          ondeEncontrar: 'Indicadores de devoluções, chamados de correção, relatórios de não-conformidade da qualidade.',
          impactoParaPromocao: 'Obrigatório para calcular a economia com eliminação de retrabalho no Arquétipo A2.',
        });
      }
      if (!registro.custoMedioErro || Number(registro.custoMedioErro) <= 0) {
        pendencias.push({
          campo: 'custoMedioErro',
          label: 'Custo Médio por Ocorrência de Erro (R$)',
          arquetipo: 'A2',
          ondeEncontrar: 'Tempo médio de reprocessamento multiplicado pela taxa horária ou histórico de perdas diretas.',
          impactoParaPromocao: 'Determina a monetização das perdas evitadas.',
        });
      }
    } else if (arq === 'A3') {
      if (!registro.volumeContatosMensal || Number(registro.volumeContatosMensal) <= 0) {
        pendencias.push({
          campo: 'volumeContatosMensal',
          label: 'Volume de Atendimentos / Contatos por Mês',
          arquetipo: 'A3',
          ondeEncontrar: 'Central de Atendimento ao Cliente (CSS), ferramenta de HelpDesk/Chatbot ou telefonia.',
          impactoParaPromocao: 'Dimensiona o potencial de contenção do autosserviço.',
        });
      }
    } else if (arq === 'A4') {
      if (!registro.impactoFinanceiroOcorrencia || Number(registro.impactoFinanceiroOcorrencia) <= 0) {
        pendencias.push({
          campo: 'impactoFinanceiroOcorrencia',
          label: 'Impacto Financeiro de Multa ou Glosa Contratual (R$)',
          arquetipo: 'A4',
          ondeEncontrar: 'Contratos com clientes/órgãos reguladores, cláusulas de SLA e histórico de penalidades.',
          impactoParaPromocao: 'Permite calcular a mitigação de risco regulatório/financeiro no Arquétipo A4.',
        });
      }
    }

    // 4. Variáveis de Setup e Engenharia (N2)
    if (Number(registro.esforcoSetupSemanas) > 0) {
      camposPreenchidos++;
    } else {
      pendencias.push({
        campo: 'esforcoSetupSemanas',
        label: 'Estimativa de Esforço de Desenvolvimento (Semanas)',
        arquetipo: 'Setup',
        ondeEncontrar: 'Validação técnica prévia do Analista da FCAIA com base na complexidade e sistemas legados.',
        impactoParaPromocao: 'Obrigatório para apurar investimento inicial e calcular Payback e VPL (N2).',
      });
    }

    if (Number(registro.horasRobo) > 0 || Number(registro.horasRoboDiurno) > 0) {
      camposPreenchidos++;
    } else {
      pendencias.push({
        campo: 'horasRobo',
        label: 'Horas Mensais de Execução do Robô (Turnos)',
        arquetipo: 'TO BE',
        ondeEncontrar: 'Dimensionamento da esteira de RPA / tempo estimado por execução pelo robô.',
        impactoParaPromocao: 'Necessário para apurar o custo operacional pós-automação.',
      });
    }

    if (registro.perfilPlataformaId) camposPreenchidos++;

    const percentualPreenchimento = Math.min(100, Math.round((camposPreenchidos / totalCamposChave) * 100));

    let proximoNivel = 'N1 - Business Case Parcial';
    if (nivelAtual === 'N0') {
      proximoNivel = 'N1 - Business Case Parcial';
      recomendacoes.push('Realize a medição de tempo e volume junto à equipe de negócio para desbloquear o nível N1.');
    } else if (nivelAtual === 'N1') {
      proximoNivel = 'N2 - Business Case Completo';
      recomendacoes.push('Solicite a avaliação técnica do Analista FCAIA para estimar o esforço de setup (semanas) e alocação de turnos.');
    } else if (nivelAtual === 'N2') {
      proximoNivel = 'N3 - Benefício Realizado (Pós-Implantação)';
      recomendacoes.push('O business case está completo e pronto para defesa orçamentária. Após entrega, cadastre os indicadores apurados.');
    } else {
      proximoNivel = 'Ciclo Concluído';
      recomendacoes.push('Processo em operação com benefício acompanhado em produção.');
    }

    return {
      nivelAtual,
      proximoNivel,
      percentualPreenchimento,
      pendencias,
      recomendacoes,
    };
  }
}
