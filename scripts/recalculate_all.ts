import { PrismaClient } from '@prisma/client';
import { CalculationService } from '../src/server/services/calculation.service.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Iniciando recálculo do Score de Priorização para todos os registros...');

  const parametro = await prisma.parametro.findUnique({
    where: { id: 'singleton' },
  });

  if (!parametro) {
    console.error('❌ Parâmetro singleton não encontrado!');
    return;
  }

  const registros = await prisma.registro.findMany({
    include: {
      perfilPlataforma: true,
    },
  });

  console.log(`📋 Encontradas ${registros.length} oportunidades para atualizar.`);

  let updatedCount = 0;

  for (const reg of registros) {
    const calculated = CalculationService.calculate(
      {
        ...(reg as any),
        perfilPlataformaId: reg.perfilPlataformaId || undefined,
        perfilPlataforma: reg.perfilPlataforma || undefined,
      },
      parametro
    );

    await prisma.registro.update({
      where: { id: reg.id },
      data: {
        scorePriorizacao: calculated.scorePriorizacao,
        vpl3Anos: calculated.vpl3Anos,
        beneficioLiquidoAnual: calculated.beneficioLiquidoAnual,
        paybackMeses: calculated.paybackMeses,
        pontuacaoBeneficios: calculated.pontuacaoBeneficios,
        fteLiberado: calculated.fteLiberado,
      } as any,
    });

    console.log(`  ✅ [${reg.idAnalise}] ${reg.nomeProcesso}: Score Priorização = ${calculated.scorePriorizacao} pts | VPL = R$ ${calculated.vpl3Anos.toFixed(2)} | Intangíveis = ${calculated.pontuacaoBeneficios}%`);
    updatedCount++;
  }

  console.log(`\n🎉 Concluído com sucesso! ${updatedCount} oportunidades atualizadas.`);
}

main()
  .catch((e) => {
    console.error('Erro durante recálculo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
