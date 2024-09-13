import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

import { PrismaModule } from '../../config/database/prisma.module';

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
  imports: [
    PrismaModule,
    Category,
    Subcategory
  ],
})
export class SubcategoriesModule {}
