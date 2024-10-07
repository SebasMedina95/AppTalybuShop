import { Module } from '@nestjs/common';

import { CategoriesController } from './categories.controller';
import { SubCategoriesController } from './subcategories.controller';
import { ProvidersController } from './providers.controller';
import { ProductsController } from './products.controller';
import { NatsModule } from '../transports/nats.module';

@Module({
  controllers: [
    CategoriesController,
    SubCategoriesController,
    ProvidersController,
    ProductsController 
  ],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class ProductsModule {}
