import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Populando banco de dados inicial...');

  // 1. Parametrização Singleton
  const defaultParametro = await prisma.parametro.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      pesoAumentarCapacidade: 2,
      pesoTransformacaoDigital: 1,
      pesoLiberarPessoas: 3,
      pesoMelhorarExpCliente: 1,
      pesoReduzirCusto: 3,
      pesoReduzirErros: 2,
      pesoReduzirFte: 3,
      pesoReduzirTempoResposta: 2,
      cargaHorariaPadrao: 160,
      operadorSalaControle: 4000,
      servidor: 1150.70,
      licencaRobo: 3325,
      estacaoTrabalhoRobo: 125,
      nrRobos: 1,
      percDiurno: 0.60,
      percNoturno: 0.30,
      percFimDeSemana: 0.10,
      custoHoraDesenvolvimento: 165,
    },
  });

  console.log('Parâmetro padrão criado/atualizado:', defaultParametro.id);

  // 2. Registros de Exemplo
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
      benAumentarCapacidade: 'principal',
      benTransformacaoDigital: 'bastante',
      benLiberarPessoas: 'principal',
      benMelhorarExpCliente: 'pouco',
      benReduzirCusto: 'principal',
      benReduzirErros: 'principal',
      benReduzirFte: 'principal',
      benReduzirTempoResposta: 'bastante',
      pontuacaoBeneficios: 0.88,
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
      investimentoSetup: 1650, // 3 semanas * (165*40/12)
      horasRobo: 160,
      custoHorasRobo: 3931.75,
      horasApoioNegocio: 8,
      custoHorasNegocio: 360,
      horasManutencao: 10,
      custoManutencao: 380.95,
      custoMensalAno1: 6322.70,
      custoMensalAno2: 4672.70,
      custoAnualAno1: 75872.40,
      custoAnualAno2: 56072.40,
      roiAno1: 53727.60,
      roiAno2: 127255.20,
      paybackMeses: 7.0,
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
      benAumentarCapacidade: 'pouco',
      benTransformacaoDigital: 'bastante',
      benLiberarPessoas: 'principal',
      benMelhorarExpCliente: 'pouco',
      benReduzirCusto: 'bastante',
      benReduzirErros: 'principal',
      benReduzirFte: 'bastante',
      benReduzirTempoResposta: 'bastante',
      pontuacaoBeneficios: 0.72,
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
      investimentoSetup: 1100,
      horasRobo: 40,
      custoHorasRobo: 351.05,
      horasApoioNegocio: 4,
      custoHorasNegocio: 240,
      horasManutencao: 4,
      custoManutencao: 152.38,
      custoMensalAno1: 1843.43,
      custoMensalAno2: 743.43,
      custoAnualAno1: 22121.16,
      custoAnualAno2: 8921.16,
      roiAno1: 35478.84,
      roiAno2: 74157.68,
      paybackMeses: 4.6,
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
      benAumentarCapacidade: 'principal',
      benTransformacaoDigital: 'principal',
      benLiberarPessoas: 'principal',
      benMelhorarExpCliente: 'principal',
      benReduzirCusto: 'principal',
      benReduzirErros: 'bastante',
      benReduzirFte: 'principal',
      benReduzirTempoResposta: 'principal',
      pontuacaoBeneficios: 0.94,
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
      investimentoSetup: 2200,
      horasRobo: 120,
      custoHorasRobo: 537.54,
      horasApoioNegocio: 6,
      custoHorasNegocio: 210,
      horasManutencao: 8,
      custoManutencao: 304.76,
      custoMensalAno1: 3252.30,
      custoMensalAno2: 1052.30,
      custoAnualAno1: 39027.60,
      custoAnualAno2: 12627.60,
      roiAno1: 28172.40,
      roiAno2: 74744.80,
      paybackMeses: 7.0,
    }
  ];

  for (const reg of registrosExemplo) {
    const existing = await prisma.registro.findFirst({
      where: { idOrigem: reg.idOrigem },
    });
    if (!existing) {
      await prisma.registro.create({
        data: reg,
      });
      console.log(`Registro criado: ${reg.idAnalise} - ${reg.nomeProcesso}`);
    }
  }

  console.log('Seed finalizado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
