import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, BadRequestException, } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { extname } from 'path';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

@Controller('api/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + extname(file.originalname);
        cb(null, uniqueSuffix);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP.'), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const imageUrl = file ? `/uploads/${file.filename}` : '';
    return this.productosService.create({
      name: body.name,
      stock: Number(body.stock),
      price: Number(body.price),
      imageUrl,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + extname(file.originalname);
        cb(null, uniqueSuffix);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP.'), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const updateData: any = {
      name: body.name,
      stock: Number(body.stock),
      price: Number(body.price),
    };
    if (file) {
      updateData.imageUrl = `/uploads/${file.filename}`;
    }
    return this.productosService.update(Number(id), updateData);
  }

  @Post(':id/restar-stock')
  async restarStock(@Param('id') id: string, @Body('cantidad') cantidad: number) {
    return this.productosService.restarStock(Number(id), cantidad);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productosService.delete(Number(id));
  }
}
