import { Module } from '@nestjs/common';
import { ComprasModule } from './compras/compras.module';
import { ProductosController } from './productos/productos.controller';
import { ProductosModule } from './productos/productos.module';
@Module({
  imports: [ComprasModule, ProductosModule],
  controllers: [ProductosController],
})
export class AppModule { }
