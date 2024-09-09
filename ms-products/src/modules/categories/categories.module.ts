import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/database/prisma.module';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

import { Category } from './entities/category.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    PrismaModule,
    Category
  ],
})
export class CategoriesModule {}
