import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NATS_SERVICE } from '../../config/services';
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
        name: NATS_SERVICE, 
        transport: Transport.NATS, //Debe ser el mismo que tenemos en el MS de Productos
        options: {
          servers: envs.NATS_SERVERS
        }
      },
    ]),
  ]
})
export class OrdersHeadersModule {}
