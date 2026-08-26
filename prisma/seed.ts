import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Populando banco de dados com calibração governamental...');

  // 1. Parametrização Singleton
  const defaultParametro = await prisma.parametro.upsert({
    where: { id: 'singleton' },
    update: {
      pesoLiberarPessoas: 3,
      pesoReduzirCusto: 3,
      pesoReduzirErros: 3,
      pesoMelhorarExpCliente: 3,
      pesoAumentarCapacidade: 2,
      pesoReduzirTempoResposta: 2,
      pesoTransformacaoDigital: 1,
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
      custoHoraDesenvolvimento: 185,
    },
    create: {
      id: 'singleton',
      pesoLiberarPessoas: 3,
      pesoReduzirCusto: 3,
      pesoReduzirErros: 3,
      pesoMelhorarExpCliente: 3,
      pesoAumentarCapacidade: 2,
      pesoReduzirTempoResposta: 2,
      pesoTransformacaoDigital: 1,
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
      custoHoraDesenvolvimento: 185,
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
      descricao: 'Desenvolvimento rápido de portais de processo com interação humana (human-in-the-loop), formulários dinâmicos e aprovações.',
      custoLicencaMensal: 1200,
      custoEstacaoTrabalho: 0,
      custoServidor: 1150.70,
      nrRobosDiluicao: 5,
      isPadrao: false,
    },
  ];

  for (const p of perfisSeed) {
    await prisma.perfilPlataforma.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
    console.log(`Perfil de Plataforma sincronizado: ${p.nome}`);
  }

  // 3. Registros de Exemplo
  const registrosExemplo = [
    {
      idOrigem: 'FIN-001',
      idAnalise: 'P1',
      area: 'Contabilidade',
      nomeProcesso: 'Lançamento de Notas Fiscais e Conciliação',
      dataLevantamento: '2026-02-15',
      participantes: 'Carlos Silva (Analista Contábil), Maria Santos (Coordenadora)',
      situacao: 'Aprovado',
      areasEnvolvidas: 'Contabilidade, Fiscal, Financeiro',
      descricaoProcesso: 'Extração diária de XMLs da SEFAZ, validação de chaves no ERP e lançamento contábil manual das faturas.',
      numExecucoes: 1200,
      periodicidade: 'Diária',
      numPessoasEnvolvidas: 3,
      tipoAlocacao: 'Dedicada',
      perfilExecutor: 'Analista Fiscal Jr',
      valorHoraExecutor: 45,
      tempoExecucao: 240, // 240 horas/mês
      custoMensalAtual: 10800, // 240 * 45
      sistemasEnvolvidos: 'SAP ERP, Portal SEFAZ, Excel, Outlook',
      documentosApoio: 'Manual de Lançamento de NFs v3.pdf',
      benLiberarPessoas: 'principal',
      benReduzirCusto: 'principal',
      benReduzirErros: 'principal',
      benMelhorarExpCliente: 'bastante',
      benAumentarCapacidade: 'principal',
      benReduzirTempoResposta: 'bastante',
      benTransformacaoDigital: 'bastante',
      pontuacaoBeneficios: 0.91,
      tipoPlataformaNome: 'Python & Robot Framework (Open Source / Cloud Native)',
      perfilPlataformaId: 'perfil-python-robot',
      descricaoSolucao: 'Robô RPA executando em background, capturando XML via API/portal, processando no SAP e gerando relatório de divergências.',
      pontosAtencao: 'Necessidade de certificado digital A1 instalado no servidor.',
      fteLiberado: 1.5,
      reducaoTempoPrevista: '85%',
      complexidade: 'Média',
      reducaoCustoPrevista: '75%',
      numRotinas: 2,
      turno: 'Diurno',
      recomendacao: 'Recomendado',
      esforcoSetupSemanas: 3,
      investimentoSetup: 1850,
      horasRobo: 160,
      custoHorasRobo: 789.05,
      horasApoioNegocio: 8,
      custoHorasNegocio: 360,
      horasManutencao: 10,
      custoManutencao: 714.28,
      custoMensalAno1: 3713.33,
      custoMensalAno2: 1863.33,
      custoAnualAno1: 44560.00,
      custoAnualAno2: 22360.00,
      roiAno1: 85040.00,
      roiAno2: 107240.00,
      paybackMeses: 4.1,
    },
    {
      idOrigem: 'RH-002',
      idAnalise: 'P2',
      area: 'Recursos Humanos',
      nomeProcesso: 'Conferência e Fechamento da Folha de Pagamento',
      dataLevantamento: '2026-02-20',
      participantes: 'Juliana Mendes (RH), Roberto Lima (TI)',
      situacao: 'Em levantamento',
      areasEnvolvidas: 'RH, DP, Financeiro',
      descricaoProcesso: 'Cruzamento mensal de relatórios de ponto, atestados e benefícios para cálculo de proventos e encargos.',
      numExecucoes: 1,
      periodicidade: 'Mensal',
      numPessoasEnvolvidas: 2,
      tipoAlocacao: 'Parcial',
      perfilExecutor: 'Especialista em DP',
      valorHoraExecutor: 60,
      tempoExecucao: 80,
      custoMensalAtual: 4800,
      sistemasEnvolvidos: 'Senior RH, ADP, Ponto Eletrônico',
      documentosApoio: 'Checklist Folha.xlsx',
      benLiberarPessoas: 'principal',
      benReduzirCusto: 'bastante',
      benReduzirErros: 'principal',
      benMelhorarExpCliente: 'pouco',
      benAumentarCapacidade: 'pouco',
      benReduzirTempoResposta: 'bastante',
      benTransformacaoDigital: 'bastante',
      pontuacaoBeneficios: 0.76,
      tipoPlataformaNome: 'n8n Workflow Automation (Self-Hosted Nuvem Gov)',
      perfilPlataformaId: 'perfil-n8n',
      descricaoSolucao: 'Automação de extração e validação de regras de inconsistências em planilha com envio de alertas automáticos.',
      pontosAtencao: 'Datas de corte rígidas no fim do mês.',
      fteLiberado: 0.5,
      reducaoTempoPrevista: '70%',
      complexidade: 'Baixa',
      reducaoCustoPrevista: '60%',
      numRotinas: 1,
      turno: 'Noturno',
      recomendacao: 'Recomendado',
      esforcoSetupSemanas: 2,
      investimentoSetup: 1233.33,
      horasRobo: 40,
      custoHorasRobo: 140.91,
      horasApoioNegocio: 4,
      custoHorasNegocio: 240,
      horasManutencao: 4,
      custoManutencao: 285.71,
      custoMensalAno1: 1899.95,
      custoMensalAno2: 666.62,
      custoAnualAno1: 22799.40,
      custoAnualAno2: 7999.44,
      roiAno1: 34800.60,
      roiAno2: 49600.56,
      paybackMeses: 4.7,
    },
    {
      idOrigem: 'TES-003',
      idAnalise: 'P3',
      area: 'Tesouraria',
      nomeProcesso: 'Gestão de Cobrança e Emissão de Boletos',
      dataLevantamento: '2026-02-22',
      participantes: 'Fernando Costa (Financeiro)',
      situacao: 'Em implantação',
      areasEnvolvidas: 'Tesouraria, Atendimento',
      descricaoProcesso: 'Geração em lote de remessas bancárias, envio de boletos por e-mail e conciliação de retornos bancários.',
      numExecucoes: 3000,
      periodicidade: 'Diária',
      numPessoasEnvolvidas: 2,
      tipoAlocacao: 'Dedicada',
      perfilExecutor: 'Assistente Financeiro',
      valorHoraExecutor: 35,
      tempoExecucao: 160,
      custoMensalAtual: 5600,
      sistemasEnvolvidos: 'Banco do Brasil, Itaú, ERP Interno',
      documentosApoio: 'Fluxo de Cobrança.docx',
      benLiberarPessoas: 'principal',
      benReduzirCusto: 'principal',
      benReduzirErros: 'principal',
      benMelhorarExpCliente: 'principal',
      benAumentarCapacidade: 'principal',
      benReduzirTempoResposta: 'principal',
      benTransformacaoDigital: 'principal',
      pontuacaoBeneficios: 1.0,
      tipoPlataformaNome: 'Microsoft Power Automate Desktop',
      perfilPlataformaId: 'perfil-power-automate',
      descricaoSolucao: 'Processamento automático de arquivos CNAB240, geração de links de pagamento e disparo WhatsApp/E-mail.',
      pontosAtencao: 'Garantir tolerância a falhas na comunicação com APIs bancárias.',
      fteLiberado: 1.0,
      reducaoTempoPrevista: '90%',
      complexidade: 'Média',
      reducaoCustoPrevista: '80%',
      numRotinas: 3,
      turno: 'Final de Semana',
      recomendacao: 'Recomendado',
      esforcoSetupSemanas: 4,
      investimentoSetup: 2466.67,
      horasRobo: 120,
      custoHorasRobo: 166.42,
      horasApoioNegocio: 6,
      custoHorasNegocio: 210,
      horasManutencao: 8,
      custoManutencao: 571.43,
      custoMensalAno1: 3414.52,
      custoMensalAno2: 947.85,
      custoAnualAno1: 40974.24,
      custoAnualAno2: 11374.20,
      roiAno1: 26225.76,
      roiAno2: 55825.80,
      paybackMeses: 7.3,
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
      console.log(`Registro atualizado com novos parâmetros: ${reg.idAnalise} - ${reg.nomeProcesso}`);
    } else {
      await prisma.registro.create({
        data: reg,
      });
      console.log(`Registro criado: ${reg.idAnalise} - ${reg.nomeProcesso}`);
    }
  }

  console.log('Seed governamental finalizado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
