import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NATS_SERVICE } from '../../config/services';
import { envs } from '../../config/envs';

import { CategoriesController } from './categories.controller';
import { SubCategoriesController } from './subcategories.controller';
import { ProvidersController } from './providers.controller';
import { ProductsController } from './products.controller';

@Module({
  controllers: [
    CategoriesController,
    SubCategoriesController,
    ProvidersController,
    ProductsController 
  ],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: NATS_SERVICE, 
        transport: Transport.NATS, //Debe ser el mismo que tenemos en el MS de Productos
        options: {
          servers: envs.NATS_SERVERS
        }
      },
    ]),
  ]
})
export class ProductsModule {}
