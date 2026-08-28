import { prisma } from '../lib/prisma.js';

export interface AreaInput {
  nome: string;
  sigla?: string;
  responsavel?: string;
  descricao?: string;
}

export class AreaService {
  static async getAll() {
    return prisma.area.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  static async getById(id: string) {
    return prisma.area.findUnique({
      where: { id },
    });
  }

  static async create(data: AreaInput) {
    return prisma.area.create({
      data: {
        nome: data.nome.trim(),
        sigla: (data.sigla || '').trim().toUpperCase(),
        responsavel: (data.responsavel || '').trim(),
        descricao: (data.descricao || '').trim(),
      },
    });
  }

  static async update(id: string, data: Partial<AreaInput>) {
    return prisma.area.update({
      where: { id },
      data: {
        ...(data.nome ? { nome: data.nome.trim() } : {}),
        ...(data.sigla !== undefined ? { sigla: data.sigla.trim().toUpperCase() } : {}),
        ...(data.responsavel !== undefined ? { responsavel: data.responsavel.trim() } : {}),
        ...(data.descricao !== undefined ? { descricao: data.descricao.trim() } : {}),
      },
    });
  }

  static async delete(id: string) {
    return prisma.area.delete({
      where: { id },
    });
  }
}
