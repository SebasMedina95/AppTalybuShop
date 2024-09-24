import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/database/prisma.module';

import { ProductsService } from './products.service';
import { FilesService } from '../../helpers/files/files.service';

import { ProductsController } from './products.controller';

import { Product } from './entities/product.entity';
import { Image } from './entities/image.entity';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    FilesService
  ],
  imports: [
    PrismaModule,
    Product,
    Image
  ],
})
export class ProductsModule {}
