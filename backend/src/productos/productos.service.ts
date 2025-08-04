import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductosService {
  private prisma = new PrismaClient();
  async findAll() {
    try {
      const productos = await this.prisma.product.findMany();
      console.log('Productos encontrados:', productos);
      return productos;
    }  catch (error) {
  console.error('❌ Error real en findAll():', error.message, '\nStack:', error.stack);
  throw new BadRequestException('Error al obtener productos');
}

  }
  /* 
    async findAll() {
      return this.prisma.product.findMany();
    } */

  async create(data: { name: string; stock: number; price: number; imageUrl?: string }) {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async restarStock(id: number, cantidad: number) {
    const producto = await this.prisma.product.findUnique({ where: { id } });
    if (!producto || producto.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }
    return this.prisma.product.update({
      where: { id },
      data: { stock: producto.stock - cantidad },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
