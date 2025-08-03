 // src/compras/compras.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ComprasService {
  private prisma = new PrismaClient();

  async crearCompra(items: any[]) {
    return this.prisma.purchase.create({
      data: { items },
    });
  }

  async obtenerHistorial() {
    return this.prisma.purchase.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async limpiarHistorial() {
    return this.prisma.purchase.deleteMany();
  }
}
