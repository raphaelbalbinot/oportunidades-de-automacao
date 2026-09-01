import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Populando banco de dados com parametrização corporativa expandida V2.0...');

  // 1. Parametrização Singleton (12 Critérios Corporativos + Parâmetros Financeiros V2.0)
  const defaultParametro = await prisma.parametro.upsert({
    where: { id: 'singleton' },
    update: {
      pesoLiberarPessoas: 3,
      pesoReduzirCusto: 3,
      pesoReduzirErros: 3,
      pesoSegurancaPrivacidade: 3,
      pesoRastreabilidadeCompliance: 3,
      pesoKeyPersonRisk: 2,
      pesoMelhorarExpCliente: 2,
      pesoAumentarCapacidade: 2,
      pesoReduzirTempoResposta: 2,
      pesoInteroperabilidade: 2,
      pesoTransformacaoDigital: 1,
      pesoSustentabilidadeEsg: 1,
      pesoReduzirFte: 0,
      cargaHorariaPadrao: 160,
      operadorSalaControle: 7500,
      servidor: 1150.70,
      licencaRobo: 0,
      estacaoTrabalhoRobo: 0,
      nrRobos: 5,
      percDiurno: 0.60,
      percNoturno: 0.30,
      percFimDeSemana: 0.10,
      salarioDesenvolvedorI: 10000,
      salarioDesenvolvedorII: 18500,
      salarioDesenvolvedorIII: 26000,
      custoHoraDesenvolvimento: 185,
      taxaDescontoVpl: 0.12,
      horizonteVplMeses: 36,
    },
    create: {
      id: 'singleton',
      pesoLiberarPessoas: 3,
      pesoReduzirCusto: 3,
      pesoReduzirErros: 3,
      pesoSegurancaPrivacidade: 3,
      pesoRastreabilidadeCompliance: 3,
      pesoKeyPersonRisk: 2,
      pesoMelhorarExpCliente: 2,
      pesoAumentarCapacidade: 2,
      pesoReduzirTempoResposta: 2,
      pesoInteroperabilidade: 2,
      pesoTransformacaoDigital: 1,
      pesoSustentabilidadeEsg: 1,
      pesoReduzirFte: 0,
      cargaHorariaPadrao: 160,
      operadorSalaControle: 7500,
      servidor: 1150.70,
      licencaRobo: 0,
      estacaoTrabalhoRobo: 0,
      nrRobos: 5,
      percDiurno: 0.60,
      percNoturno: 0.30,
      percFimDeSemana: 0.10,
      salarioDesenvolvedorI: 10000,
      salarioDesenvolvedorII: 18500,
      salarioDesenvolvedorIII: 26000,
      custoHoraDesenvolvimento: 185,
      taxaDescontoVpl: 0.12,
      horizonteVplMeses: 36,
    },
  });

  console.log('Parâmetro padrão criado/atualizado:', defaultParametro.id);

  // 2. Perfis de Plataforma Tecnológica
  const perfisSeed = [
    {
      id: 'perfil-python-robot',
      nome: 'Python & Robot Framework (Open Source / Cloud Native)',
      categoria: 'Open Source / Scripting',
      descricao: 'Automações em lote, APIs, web scraping, scripts Python e Robot Framework rodando em containers Kubernetes sem custos de licença.',
      custoLicencaMensal: 0,
      custoEstacaoTrabalho: 0,
      custoServidor: 1150.70,
      nrRobosDiluicao: 10,
      isPadrao: true,
    },
    {
      id: 'perfil-n8n',
      nome: 'n8n Workflow Automation (Self-Hosted Nuvem Gov)',
      categoria: 'Workflow & iPaaS',
      descricao: 'Orquestração visual de fluxos de trabalho orientados a APIs, webhooks, bancos de dados e mensageria em nuvem própria.',
      custoLicencaMensal: 0,
      custoEstacaoTrabalho: 0,
      custoServidor: 1150.70,
      nrRobosDiluicao: 10,
      isPadrao: false,
    },
    {
      id: 'perfil-power-automate',
      nome: 'Microsoft Power Automate Desktop',
      categoria: 'RPA Proprietário',
      descricao: 'Rotinas integradas ao ecossistema Microsoft 365, SharePoint, planilhas Excel avançadas e fluxos departamentais.',
      custoLicencaMensal: 780,
      custoEstacaoTrabalho: 125,
      custoServidor: 1150.70,
      nrRobosDiluicao: 5,
      isPadrao: false,
    },
    {
      id: 'perfil-outsystems',
      nome: 'OutSystems / Low-Code Platform',
      categoria: 'Low-Code / RAD',
      descricao: 'Aplicações transacionais completas com portal do cliente, formulários reativos e aprovações multi-alçada.',
      custoLicencaMensal: 2500,
      custoEstacaoTrabalho: 0,
      custoServidor: 2300,
      nrRobosDiluicao: 15,
      isPadrao: false,
    },
  ];

  for (const perfil of perfisSeed) {
    await prisma.perfilPlataforma.upsert({
      where: { id: perfil.id },
      update: perfil,
      create: perfil,
    });
  }

  console.log('Perfis de plataformas sincronizados.');

  // 3. Áreas e Diretorias Corporativas Padrão
  const areasSeed = [
    { nome: 'Faturamento / Arrecadação', sigla: 'DIFAT', responsavel: 'Coordenação de Faturamento', descricao: 'Processamento de notas fiscais, faturamento de contratos e arrecadação municipal.' },
    { nome: 'Prestação de Contas / Convênios', sigla: 'SUPFC', responsavel: 'Superintendência de Finanças e Contratos', descricao: 'Gestão, conciliação e prestação de contas de convênios federais e órgãos parceiros.' },
    { nome: 'Comercial / Negócios de Certificação', sigla: 'DICER', responsavel: 'Gerência Comercial de Identidade Digital', descricao: 'Propostas comerciais, vendas de certificados digitais ICP-Brasil e soluções de confiança.' },
    { nome: 'Auditoria Interna / Compliance', sigla: 'AUDIT', responsavel: 'Auditoria Geral', descricao: 'Auditoria contínua, conformidade com órgãos de controle e mitigação de riscos.' },
    { nome: 'Recursos Humanos', sigla: 'DIRH', responsavel: 'Gestão de Pessoas', descricao: 'Folha de pagamento, benefícios, admissão e desenvolvimento de colaboradores.' },
    { nome: 'Contabilidade', sigla: 'DECON', responsavel: 'Departamento Contábil', descricao: 'Fechamento contábil, conciliações bancárias, balanços e conformidade com o CFC.' },
    { nome: 'Tesouraria', sigla: 'DITES', responsavel: 'Gestão Financeira', descricao: 'Fluxo de caixa, emissão de boletos, conciliação bancária e pagamentos.' },
    { nome: 'Operações de TI & Sustentação', sigla: 'DEPOP', responsavel: 'Centro de Operações de Rede / NOC', descricao: 'Monitoramento 24x7, infraestrutura de nuvem, sustentação de robôs e suporte.' },
  ];

  for (const a of areasSeed) {
    await prisma.area.upsert({
      where: { nome: a.nome },
      update: a,
      create: a,
    });
  }

  console.log('Áreas corporativas sincronizadas.');

  // 4. Processos Corporativos de Referência (incluindo os 3 Casos Reais do Serpro/FCAIA)
  const registrosExemplo = [
    {
      idOrigem: 'DEM-NFSE-01',
      idAnalise: 'P1',
      area: 'Faturamento / Arrecadação',
      nomeProcesso: 'Automação e Consolidação de NFS-e Municipal',
      dataLevantamento: '2026-08-15',
      participantes: 'Equipe de Faturamento Municipal, Líder Técnico FCAIA',
      situacao: 'Concluído',
      nivelMaturidade: 'N3',
      isRetrospectivo: true,

      sintomasDor: 'Consolidação de múltiplos robôs legados em solução única padronizada, reduzindo pontos de falha e ampliando cobertura municipal.',
      criticidadePercebida: 'Alta',
      recorrenciaDor: 'Diária',

      arquetipoPrimario: 'A6',
      arquetiposSecundarios: 'A1',
      nrAtivosAntes: 8,
      nrAtivosDepois: 1,
      custoManutencaoAnualAtivo: 14500,
      percAutomatizavel: 0.95,

      percTrilhaProcesso: 0.15,
      percTrilhaSistema: 0.10,
      percTrilhaAutomacao: 0.75,
      justificativaTrilha: 'Consolidação de arquitetura técnica e padronização dos layouts municipais.',
      unidadesPiloto: 8,
      unidadesPotenciais: 26,
      custoMarginalReplicacao: 1500,
      beneficioPotencialEscala: 285000,
      coberturaInicialPerc: 0.16,
      coberturaFinalPerc: 0.41,

      areasEnvolvidas: 'Faturamento, Tributário, Operações de TI',
      descricaoProcesso: 'Processamento noturno e validação automática de notas fiscais de serviço eletrônicas de múltiplos municípios.',
      numExecucoes: 85000,
      periodicidade: 'Diária',
      numPessoasEnvolvidas: 3,
      tipoAlocacao: 'Parcial',
      perfilExecutor: 'Analista Tributário Pleno',
      valorHoraExecutor: 65,
      tempoExecucao: 120,
      custoMensalAtual: 7800,
      sistemasEnvolvidos: 'SEFAZ, Portais Municipais, ERP SAP, Robô Legado',
      documentosApoio: 'Especificação Técnica NFS-e v3, Matriz de Municípios',

      benLiberarPessoas: 'principal',
      benReduzirCusto: 'principal',
      benReduzirErros: 'principal',
      benSegurancaPrivacidade: 'bastante',
      benRastreabilidadeCompliance: 'principal',
      benKeyPersonRisk: 'principal',
      benMelhorarExpCliente: 'bastante',
      benAumentarCapacidade: 'principal',
      benReduzirTempoResposta: 'principal',
      benInteroperabilidade: 'principal',
      benTransformacaoDigital: 'principal',
      benSustentabilidadeEsg: 'bastante',
      pontuacaoBeneficios: 0.96,

      tipoPlataformaNome: 'Python & Robot Framework (Open Source / Cloud Native)',
      perfilPlataformaId: 'perfil-python-robot',
      descricaoSolucao: 'Pipeline conteinerizado no Kubernetes executando conciliação massiva no turno noturno com alertas automáticos.',
      pontosAtencao: 'Manter compatibilidade com mudanças nos schemas XML municipais.',
      fteLiberado: 0.75,
      reducaoTempoPrevista: '85%',
      complexidade: 'Alta',
      reducaoCustoPrevista: '80%',
      numRotinas: 1,

      horasRoboDiurno: 0,
      horasRoboNoturno: 90,
      horasRoboFimDeSemana: 20,
      horasRobo: 110,
      turno: 'Noturno',
      recomendacao: 'Recomendado',

      esforcoSetupSemanas: 3,
      investimentoSetup: 1850,
      custoHorasRobo: 189.45,
      horasApoioNegocio: 4,
      custoHorasNegocio: 260,
      horasManutencao: 6,
      custoManutencao: 428.57,
      custoMensalAno1: 2728.02,
      custoMensalAno2: 878.02,
      custoAnualAno1: 32736.24,
      custoAnualAno2: 10536.24,
      beneficioBrutoAnual: 101500,
      beneficioLiquidoAnual: 76125,
      roiAno1: 43388.76,
      roiAno2: 65588.76,
      paybackMeses: 5.2,
      vpl3Anos: 147820.50,
      vplCenarioConservador: 108200.00,
      vplCenarioBase: 147820.50,
      vplCenarioOtimista: 189400.00,
      beneficioRealizadoAnual: 74500,
      desvioProjetadoRealizadoPerc: -0.02,
      dataApuracaoRealizado: '2026-08-20',
      notasRealizado: 'Consolidação de 8 robôs em 1 entregou 98% da economia projetada no primeiro mês.',
    },
    {
      idOrigem: 'DEM-MAPA-05',
      idAnalise: 'P2',
      area: 'Prestação de Contas / Convênios',
      nomeProcesso: 'Prestação de Contas — Macroprocesso 05 (Piloto MAPA)',
      dataLevantamento: '2026-08-22',
      participantes: 'Gestores de Contratos, Analistas Financeiros FCAIA',
      situacao: 'Em levantamento',
      nivelMaturidade: 'N1',
      isRetrospectivo: false,

      sintomasDor: 'Consolidação manual em planilhas, esforço operacional superior ao do faturamento e risco iminente de glosa por prazo.',
      criticidadePercebida: 'Crítica',
      recorrenciaDor: 'Frequente',

      arquetipoPrimario: 'A1',
      arquetiposSecundarios: 'A2,A4',
      percAutomatizavel: 0.85,
      taxaErroAtual: 0.08,
      custoMedioErro: 120,
      impactoFinanceiroOcorrencia: 85000,
      probabilidadeDescumprimento: 0.15,

      percTrilhaProcesso: 0.20,
      percTrilhaSistema: 0.10,
      percTrilhaAutomacao: 0.70,
      justificativaTrilha: 'Redesenho prévio da planilha de conciliação antes da automação via robô.',
      unidadesPiloto: 1,
      unidadesPotenciais: 5,

      areasEnvolvidas: 'Prestação de Contas, Controladoria, MAPA',
      descricaoProcesso: 'Conferência de extratos bancários, empenhos e liquidações para prestação de contas de convênios federais.',
      numExecucoes: 450,
      periodicidade: 'Mensal',
      numPessoasEnvolvidas: 2,
      tipoAlocacao: 'Dedicada',
      perfilExecutor: 'Analista de Contratos Sr',
      valorHoraExecutor: 75,
      tempoExecucao: 160,
      custoMensalAtual: 12000,
      sistemasEnvolvidos: 'SIAFI, TransfereGov, Excel, Sistema de Convênios',
      documentosApoio: 'Instrução Normativa de Prestação de Contas',

      benLiberarPessoas: 'principal',
      benReduzirCusto: 'principal',
      benReduzirErros: 'principal',
      benSegurancaPrivacidade: 'principal',
      benRastreabilidadeCompliance: 'principal',
      benKeyPersonRisk: 'principal',
      benMelhorarExpCliente: 'bastante',
      benAumentarCapacidade: 'principal',
      benReduzirTempoResposta: 'principal',
      benInteroperabilidade: 'principal',
      benTransformacaoDigital: 'principal',
      benSustentabilidadeEsg: 'bastante',
      pontuacaoBeneficios: 0.98,

      tipoPlataformaNome: 'n8n Workflow Automation (Self-Hosted Nuvem Gov)',
      perfilPlataformaId: 'perfil-n8n',
      descricaoSolucao: 'Fluxo automatizado n8n conectando APIs do TransfereGov ao SIAFI com validação automática de saldos.',
      pontosAtencao: 'Autenticação com certificados digitais institucionais.',
      fteLiberado: 1.0,
      reducaoTempoPrevista: '80%',
      complexidade: 'Média',
      reducaoCustoPrevista: '75%',
      numRotinas: 2,

      horasRoboDiurno: 40,
      horasRoboNoturno: 20,
      horasRoboFimDeSemana: 0,
      horasRobo: 60,
      turno: 'Múltiplos Turnos',
      recomendacao: 'Recomendado',

      esforcoSetupSemanas: 3,
      investimentoSetup: 1850,
      custoHorasRobo: 124.50,
      horasApoioNegocio: 8,
      custoHorasNegocio: 600,
      horasManutencao: 4,
      custoManutencao: 285.71,
      custoMensalAno1: 2860.21,
      custoMensalAno2: 1010.21,
      custoAnualAno1: 34322.52,
      custoAnualAno2: 12122.52,
      beneficioBrutoAnual: 144000,
      beneficioLiquidoAnual: 100800,
      roiAno1: 66477.48,
      roiAno2: 88677.48,
      paybackMeses: 4.1,
      vpl3Anos: 198450.00,
      vplCenarioConservador: 142000.00,
      vplCenarioBase: 198450.00,
      vplCenarioOtimista: 254000.00,
    },
    {
      idOrigem: 'DEM-CERT-03',
      idAnalise: 'P3',
      area: 'Comercial / Negócios de Certificação',
      nomeProcesso: 'Elaboração e Resposta a Propostas de Certificado Digital',
      dataLevantamento: '2026-08-25',
      participantes: 'Executivos de Contas, Gerência Comercial Serpro',
      situacao: 'Em levantamento',
      nivelMaturidade: 'N0',
      isRetrospectivo: false,

      sintomasDor: 'Elaboração manual e descentralizada de propostas comerciais, com demora na resposta a clientes e perda de licitações por prazo.',
      criticidadePercebida: 'Alta',
      recorrenciaDor: 'Frequente',

      arquetipoPrimario: 'A7',
      arquetiposSecundarios: 'A1,A5',
      numSolicitacoesComerciaisMes: 45,
      taxaConversaoAtual: 0.20,
      taxaConversaoAlvo: 0.35,
      ticketMedioProposta: 18000,
      percPerdasPorPrazo: 0.25,

      percTrilhaProcesso: 0.10,
      percTrilhaSistema: 0.15,
      percTrilhaAutomacao: 0.75,
      justificativaTrilha: 'Integração de catálogo de produtos com formulário de propostas.',

      areasEnvolvidas: 'Comercial, Jurídico, Produtos de Identidade Digital',
      descricaoProcesso: 'Recepção de editais e solicitações de cotação de certificados digitais e montagem manual da proposta de preços.',
      numExecucoes: 45,
      periodicidade: 'Semanal',
      numPessoasEnvolvidas: 2,
      tipoAlocacao: 'Parcial',
      perfilExecutor: 'Consultor de Vendas Corporativas',
      valorHoraExecutor: 70,
      tempoExecucao: 60,
      custoMensalAtual: 4200,
      sistemasEnvolvidos: 'CRM Corporativo, ERP, Portal de Compras Governamentais',
      documentosApoio: 'Tabela de Preços de Certificados ICP-Brasil',

      benLiberarPessoas: 'bastante',
      benReduzirCusto: 'bastante',
      benReduzirErros: 'bastante',
      benSegurancaPrivacidade: 'bastante',
      benRastreabilidadeCompliance: 'principal',
      benKeyPersonRisk: 'bastante',
      benMelhorarExpCliente: 'principal',
      benAumentarCapacidade: 'principal',
      benReduzirTempoResposta: 'principal',
      benInteroperabilidade: 'principal',
      benTransformacaoDigital: 'principal',
      benSustentabilidadeEsg: 'pouco',
      pontuacaoBeneficios: 0.88,

      tipoPlataformaNome: 'OutSystems / Low-Code Platform',
      perfilPlataformaId: 'perfil-outsystems',
      descricaoSolucao: 'Gerador inteligente de propostas com preenchimento assistido, precificação paramétrica e geração automática de minutas em PDF.',
      pontosAtencao: 'Integração com regras de descontos de alçadas comerciais.',
      fteLiberado: 0.38,
      reducaoTempoPrevista: '75%',
      complexidade: 'Média',
      reducaoCustoPrevista: '60%',
      numRotinas: 1,

      horasRoboDiurno: 30,
      horasRoboNoturno: 0,
      horasRoboFimDeSemana: 0,
      horasRobo: 30,
      turno: 'Diurno',
      recomendacao: 'Recomendado',

      esforcoSetupSemanas: 4,
      investimentoSetup: 2466.67,
      custoHorasRobo: 86.50,
      horasApoioNegocio: 4,
      custoHorasNegocio: 280,
      horasManutencao: 4,
      custoManutencao: 285.71,
      custoMensalAno1: 3118.88,
      custoMensalAno2: 652.21,
      custoAnualAno1: 37426.56,
      custoAnualAno2: 7826.52,
      beneficioBrutoAnual: 145800,
      beneficioLiquidoAnual: 109350,
      roiAno1: 71923.44,
      roiAno2: 101523.48,
      paybackMeses: 4.1,
      vpl3Anos: 224600.00,
      vplCenarioConservador: 165000.00,
      vplCenarioBase: 224600.00,
      vplCenarioOtimista: 289000.00,
    },
  ];

  for (const reg of registrosExemplo) {
    const existing = await prisma.registro.findFirst({
      where: { idOrigem: reg.idOrigem },
    });
    if (existing) {
      await prisma.registro.update({
        where: { id: existing.id },
        data: reg,
      });
      console.log(`Registro atualizado: ${reg.idAnalise} - ${reg.nomeProcesso}`);
    } else {
      await prisma.registro.create({
        data: reg,
      });
      console.log(`Registro criado: ${reg.idAnalise} - ${reg.nomeProcesso}`);
    }
  }

  console.log('Seed corporativo V2.0 finalizado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
