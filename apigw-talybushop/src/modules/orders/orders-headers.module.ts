import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ORDER_HEADERS_PURCHASE_SERVICE } from '../../config/services';
import { envs } from '../../config/envs';
import { OrderPurchaseController } from './order-purchase.controller';


@Module({
  controllers: [
    OrderPurchaseController,
  ],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: ORDER_HEADERS_PURCHASE_SERVICE, 
        transport: Transport.TCP, //Debe ser el mismo que tenemos en el MS de Productos
        options: {
          host: envs.ORDERS_HEADER_MS_HOST,
          port: envs.ORDERS_HEADER_MS_PORT
        }
      },
    ]),
  ]
})
export class OrdersHeadersModule {}
