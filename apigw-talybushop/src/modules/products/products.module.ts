import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PRODUCTS_SERVICE } from '../../config/services';
import { envs } from '../../config/envs';

import { CategoriesController } from './categories.controller';
import { SubCategoriesController } from './subcategories.controller';

@Module({
  controllers: [
    CategoriesController,
    SubCategoriesController
  ],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: PRODUCTS_SERVICE, 
        transport: Transport.TCP, //Debe ser el mismo que tenemos en el MS de Productos
        options: {
          host: envs.PRODUCTS_MS_HOST,
          port: envs.PRODUCTS_MS_PORT
        }
      },
    ]),
  ]
})
export class ProductsModule {}
