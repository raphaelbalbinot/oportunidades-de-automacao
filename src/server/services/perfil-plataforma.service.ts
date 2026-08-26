import { prisma } from '../lib/prisma.js';

export class PerfilPlataformaService {
  static async list() {
    return await prisma.perfilPlataforma.findMany({
      orderBy: [{ isPadrao: 'desc' }, { nome: 'asc' }],
    });
  }

  static async getById(id: string) {
    return await prisma.perfilPlataforma.findUnique({
      where: { id },
    });
  }

  static async getPadrao() {
    const padrao = await prisma.perfilPlataforma.findFirst({
      where: { isPadrao: true },
    });
    if (padrao) return padrao;
    return await prisma.perfilPlataforma.findFirst();
  }

  static async create(data: any) {
    if (data.isPadrao) {
      await prisma.perfilPlataforma.updateMany({
        data: { isPadrao: false },
      });
    }

    return await prisma.perfilPlataforma.create({
      data: {
        nome: data.nome,
        categoria: data.categoria || 'Open Source / Scripting',
        descricao: data.descricao || '',
        custoLicencaMensal: Number(data.custoLicencaMensal ?? 0),
        custoEstacaoTrabalho: Number(data.custoEstacaoTrabalho ?? 0),
        custoServidor: Number(data.custoServidor ?? 1150.70),
        nrRobosDiluicao: Number(data.nrRobosDiluicao ?? 5),
        isPadrao: Boolean(data.isPadrao),
      },
    });
  }

  static async update(id: string, data: any) {
    if (data.isPadrao) {
      await prisma.perfilPlataforma.updateMany({
        where: { id: { not: id } },
        data: { isPadrao: false },
      });
    }

    return await prisma.perfilPlataforma.update({
      where: { id },
      data: {
        ...(data.nome !== undefined && { nome: data.nome }),
        ...(data.categoria !== undefined && { categoria: data.categoria }),
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.custoLicencaMensal !== undefined && { custoLicencaMensal: Number(data.custoLicencaMensal) }),
        ...(data.custoEstacaoTrabalho !== undefined && { custoEstacaoTrabalho: Number(data.custoEstacaoTrabalho) }),
        ...(data.custoServidor !== undefined && { custoServidor: Number(data.custoServidor) }),
        ...(data.nrRobosDiluicao !== undefined && { nrRobosDiluicao: Number(data.nrRobosDiluicao) }),
        ...(data.isPadrao !== undefined && { isPadrao: Boolean(data.isPadrao) }),
      },
    });
  }

  static async delete(id: string) {
    return await prisma.perfilPlataforma.delete({
      where: { id },
    });
  }
}
