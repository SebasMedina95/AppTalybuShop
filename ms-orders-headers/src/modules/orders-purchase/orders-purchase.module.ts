import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PrismaModule } from '../../config/database/prisma.module';

import { OrdersPurchaseService } from './orders-purchase.service';
import { OrdersPurchaseController } from './orders-purchase.controller';

import { OrdersPurchase } from './entities/orders-purchase.entity';
import { envs } from '../../config/envs';
import { PRODUCTS_SERVICE } from '../../config/services';

@Module({
  controllers: [OrdersPurchaseController],
  providers: [OrdersPurchaseService],
  imports: [
    PrismaModule,
    OrdersPurchase,

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

  ],
})
export class OrdersPurchaseModule {}
